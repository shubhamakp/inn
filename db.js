const mysql = require('mysql2')
const connection = mysql.createConnection({
    host : 'localhost',
    database : 'shubham',
    user : 'root',
    password: 'mypass'
})

function createTable(){
    return new Promise( function (resolve ,reject){

        connection.query(
            `create table if not exists visitors(
                name varchar(20) not null,
                email varchar(20) not null,
                contact bigint not null,
                checkin time not null,
                checkout time
            )`,
            function(err,results)
            {
                if(err)
                reject(err)
                else
                resolve()
            }
        )
    })
}

function addNewVisitor(name, email, phone, checkin){
    return new Promise(function(resolve ,reject){
        connection.query(

            `insert into visitors (name, email, contact, checkin) values(?, ?, ?, ?)`,
            [name, email, phone, checkin],
            function(err,results){
                if(err){
                reject(err)
                }
                else
                resolve()
            } 
        )

    })
}

function checkout(ch_out,name){
    return new Promise(function(resolve,reject){
        connection.query(

            `update visitors set checkout = ? where name = ?`,
            [ch_out,name],
            function(err,results){
                if(err)
                reject(err)
                else
                resolve()
            }
        )
    })
}

function userlogin(name, email){
    return new Promise(function(resolve,reject){
        connection.query('SELECT * FROM visitors WHERE name = ? AND email = ?', [name, email], function(error, results, fields) {
			if (results.length > 0) {
               resolve()
			} else {
                reject(error)
			}			
		//	response.end();
		});

    })
}

function getVisitor (email) {
    return new Promise(function (resolve,reject){
        connection.query(
            'select * from visitors where email = ?',
            [email],
            function(err,row){
                if(err)
                reject(err)
                else{
                    console.log(email)
                resolve(row)
                }
            }
        )
    })
}
exports = module.exports = {
    addNewVisitor,
    createTable,
    checkout,
    userlogin,
    getVisitor
}