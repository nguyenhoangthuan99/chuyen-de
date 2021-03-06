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
    # reverting changes because of exception
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
           # print(others)
            self.do_query(others,self.sql_insert_other)
        if len(students):
           # print(students)
            self.do_query(students,self.sql_insert_student)
        return True
    async def lock(self,Id,status):
        db = mysql.connector.connect(
                                            host="database",
                                            user=self.config.db_username,
                                            password=self.config.db_password,
                                            database=self.config.db_name
                                            )     
        mycursor = db.cursor()
        try:
            mycursor.executemany("UPDATE Account SET status=%s WHERE Id = %s",[(status,Id)])
            db.commit()
        except mysql.connector.Error as error:
            print("Failed to update record to database rollback: {}".format(error))
    # reverting changes because of exception
            db.rollback()
            mycursor.close()
            db.close()
            raise HTTPException(status_code=422, detail="Failed to update record to database rollback: {}".format(error))
        mycursor.close()
        db.close()

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
        ## place Id at the last to fit the update query
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
    # reverting changes because of exception
            db.rollback()
            return False
        mycursor.close()
        db.close()
        return True
        

    def do_search(self,sql:str):
        db = mysql.connector.connect(
                                            host="database",
                                            user=self.config.db_username,
                                            password=self.config.db_password,
                                            database=self.config.db_name
                                            )     
        mycursor = db.cursor()
        
        mycursor.execute(sql)
        try:
            records = mycursor.fetchall()
        except:
            mycursor.close()
            db.close()
            return []
        results = []
        for row in records:
            row = list(row)
            row[5] = str(row[5]) # format datetime to str
            results.append(Account(
                Id =int(row[0]),
                email =row[1],
                password =row[2],
                fullname =row[3],
                address =row[4],
                birthday =row[5],
                phone =row[6],
                status =int(row[7]),
                role =int(row[8]),
                schoolyear = int(row[9]) if row[9] is not None else None, 
                cmnd = row[10] ,
                gender = row[11] ,
                program = row[12] ,
                schoolId = row[13] ,
                maxcredit = int(row[14]) if row[14] is not None else None, 
            ))    
        
        mycursor.close()
        db.close()
        return results
    def do_count(self,sql:str):
        db = mysql.connector.connect(
                                            host="database",
                                            user=self.config.db_username,
                                            password=self.config.db_password,
                                            database=self.config.db_name
                                            )     
        mycursor = db.cursor()
        
        mycursor.execute(sql)
        result=mycursor.fetchone()
        mycursor.close()
        db.close()
        return result

    async def search( self, count = 0, limit = 20, offset=0, **kwargs) : 
        """
        Id : Optional[int]=None, email: Optional[str]=None, fullname: Optional[str]=None,\
        address : Optional[str]=None, birthday: Optional[str]=None, phone: Optional[str]=None,\
        status: Optional[int]=None, role: Optional[int]=None, schoolyear: Optional[int]=None,\
        cmnd: Optional[str]=None, gender: Optional[str]=None,program: Optional[str]=None, \
        schoolId : Optional[str]=None, maxcredit: Optional[int]=None,
        """
        if count == 0 : 
            sql = "select * from Account "
        else:
            sql = "select count(*) from Account "
        i = 0
        
        accepted = []
        for key, value in kwargs.items(): 
            if value is None: continue
            else:
                accepted.append((key, value))
        n = len(accepted)
        for key, value in accepted: 
            if type(value) == type(1):
                val = str(value)
            elif type(value) == type("s"):
                val = "'"+value+"'"
            if i == 0:
                sql += "WHERE "+str(key)+"="+val+" AND "
            
            else:
                sql += str(key)+"="+val+" AND "
            
            i+=1
        if sql[-4:] == "AND " :

            sql = sql[:-4]+" "
        if (limit is not None) and (offset is not None) and (count == 0):    
            sql += "LIMIT "+str(limit)+" OFFSET "+str(offset)
        else:
            sql = sql[:-1]
        print(sql)
        if count == 0:
            results = self.do_search(sql)
        else:
            results = self.do_count(sql)[0]
        return results

    async def count_account_like_id(self,Id,role):
        db = mysql.connector.connect(
                                            host="database",
                                            user=self.config.db_username,
                                            password=self.config.db_password,
                                            database=self.config.db_name
                                            )     
        mycursor = db.cursor()
        sql = f"select count(*) from Account where Id like '%{Id}%' and role={role}"
        print(sql)
        mycursor.execute(sql)
        
        try:
            records = mycursor.fetchall()
        except:
            mycursor.close()
            db.close()
            return []
        results = []
        for row in records:
            row = list(row)
            results.append(row[0])
        mycursor.close()
        db.close()
        return results[0]
    async def get_account_like_id(self,Id,role,limit,offset):
        db = mysql.connector.connect(
                                            host="database",
                                            user=self.config.db_username,
                                            password=self.config.db_password,
                                            database=self.config.db_name
                                            )     
        mycursor = db.cursor()
        sql = f"select * from Account where Id like '%{Id}%' and role={role} limit {limit} offset {offset}"
        print(sql)
        mycursor.execute(sql)
        
        try:
            records = mycursor.fetchall()
        except:
            mycursor.close()
            db.close()
            return []
        results = []
        for row in records:
            row = list(row)
            row[5] = str(row[5]) # format datetime to str
            results.append(Account(
                Id =int(row[0]),
                email =row[1],
                password =row[2],
                fullname =row[3],
                address =row[4],
                birthday =row[5],
                phone =row[6],
                status =int(row[7]),
                role =int(row[8]),
                schoolyear = int(row[9])  if row[9] is not None else None, 
                cmnd = row[10] ,
                gender = row[11] ,
                program = row[12] ,
                schoolId = row[13] ,
                maxcredit = int(row[14])  if row[14] is not None else None, 
            ))
        mycursor.close()
        db.close()
        return results

    async def get_account_by_id(self,Id=None,email=None):
        db = mysql.connector.connect(
                                            host="database",
                                            user=self.config.db_username,
                                            password=self.config.db_password,
                                            database=self.config.db_name
                                            )     
        mycursor = db.cursor()
        if Id is not None:
            mycursor.execute("select * from Account where Id=%s",(Id,))
        elif email is not None:
            mycursor.execute("select * from Account where email=%s",(email,))
        try:
            records = mycursor.fetchall()
        except:
            mycursor.close()
            db.close()
            return []
        results = []
        for row in records:
            row = list(row)
            row[5] = str(row[5]) # format datetime to str
            results.append(Account(
                Id =int(row[0]),
                email =row[1],
                password =row[2],
                fullname =row[3],
                address =row[4],
                birthday =row[5],
                phone =row[6],
                status =int(row[7]),
                role =int(row[8]),
                schoolyear = int(row[9])  if row[9] is not None else None, 
                cmnd = row[10] ,
                gender = row[11] ,
                program = row[12] ,
                schoolId = row[13] ,
                maxcredit = int(row[14])  if row[14] is not None else None, 
            ))
        mycursor.close()
        db.close()
        return results



