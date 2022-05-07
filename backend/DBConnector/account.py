import mysql.connector
from config import Settings
from model.model import *
from fastapi import HTTPException
from typing import List, Optional
import time
class AccountConnector:
    def __init__(self, ):
        self.config = Settings()
        """
        self.db = mysql.connector.connect(
                                            host="database",
                                            user=self.config.db_username,
                                            password=self.config.db_password,
                                            database=self.config.db_name
                                            )
        """
        self.sql_insert_other = "INSERT INTO Account (Id, email, password, fullname, address, birthday, phone, status, role) VALUES (%s,%s, %s, %s, %s, %s,%s,%s,%s)"
        self.sql_insert_student =  "INSERT INTO Account (Id, email, password, fullname, address, birthday, phone, status, role, schoolyear, cmnd,gender,program, schoolId,maxcredit) VALUES (%s,%s, %s, %s, %s, %s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
        self.sql_update_other = "UPDATE Account SET  email=%s,  fullname=%s, address=%s, birthday=%s, phone=%s, status=%s, role=%s WHERE Id = %s"
        self.sql_update_student = "UPDATE Account SET  email=%s, fullname=%s, address=%s, birthday=%s, phone=%s, status=%s, role=%s,schoolyear=%s, cmnd=%s,gender=%s,program=%s, schoolId=%s,maxcredit=%s WHERE Id = %s"

    def validate(self,account:Account):
        if account.role == 1:
            if (account.schoolyear is None) or ( account.cmnd  is None) or\
                    (account.gender  is None) or ( account.program  is None) or\
                    (account.schoolId  is None) or ( account.maxcredit  is None): 
                raise HTTPException(status_code=422, detail="Invalid Schema")
        
        return True

    def object2data(self,account:Account):
        account = account.dict()
        account = tuple(list(account.values()))
        return account

    def do_query(self,accounts:List[tuple],sql_other:str):   
        db = mysql.connector.connect(
                                    host="database",
                                    user=self.config.db_username,
                                    password=self.config.db_password,
                                    database=self.config.db_name
                                    )     
        mycursor = db.cursor()
        try:
            mycursor.executemany(sql_other,accounts)
            db.commit()
        except mysql.connector.Error as error:
            print("Failed to update record to database rollback: {}".format(error))
            db.rollback()
            mycursor.close()
            db.close()
            raise HTTPException(status_code=422, detail="Failed to update record to database rollback: {}".format(error))
        mycursor.close()
        db.close()
    
    async def insert(self,accounts : List[Account]):
            others = []
            students = []
            start = time.time()
            for acc in accounts:
                try:
                    if self.validate(acc):
                        if acc.role == 1:
                            students.append(acc)
                        else:
                            others.append(acc)                   
                except:
                    raise HTTPException(status_code=422, detail="Invalid Schema")
            print("validate time in connector",time.time()-start)
            students = [self.object2data(x) for x in students]
            others = [self.object2data(x) for x in others]
            others = [(*x[:9],) for x in others ]
            if len(others):
                self.do_query(others,self.sql_insert_other)
            if len(students):
                self.do_query(students,self.sql_insert_student)
            return True

    async def update(self,accounts : List[Account]):
        others = []
        students = []
        for acc in accounts:
            try:
                if self.validate(acc):
                    if acc.role == 1:
                        students.append(acc)
                    else:
                        others.append(acc)                   
            except:
                raise HTTPException(status_code=422, detail="Invalid Schema")
        students = [self.object2data(x) for x in students]
        others = [self.object2data(x) for x in others]
        students = [(x[1],*x[3:],x[0]) for x in students]
        others = [(x[1],*x[3:9],x[0]) for x in others ]
        if len(others):
            print(others)
            self.do_query(others,self.sql_update_other)
        if len(students):
            print(students)
            self.do_query(students,self.sql_update_student)
        return True
    
    async def update_password(self,Id,hashed_password):
        db = mysql.connector.connect(
                                            host="database",
                                            user=self.config.db_username,
                                            password=self.config.db_password,
                                            database=self.config.db_name
                                            )     
        mycursor = db.cursor()
        sql = "UPDATE Account SET  password=%s WHERE Id = %s"
        try:
            mycursor.execute(sql,(hashed_password,Id))
            db.commit()
        except mysql.connector.Error as error:
            print("Failed to update record to database rollback: {}".format(error))
            db.rollback()
            return False
        mycursor.close()
        db.close()
        return True