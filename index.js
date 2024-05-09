#! /usr/bin/env node
import { faker } from "@faker-js/faker";
import inquirer from "inquirer";
import chalk from "chalk";
// Customer class
class Customer {
    firstName;
    lastName;
    age;
    gender;
    phoneNumber;
    accountNumber;
    constructor(fname, lname, age, gen, phone, accnumber) {
        this.firstName = fname;
        this.lastName = lname;
        this.age = age;
        this.gender = gen;
        this.phoneNumber = phone;
        this.accountNumber = accnumber;
    }
}
// Class Bank
class Bank {
    customer = [];
    account = [];
    AddCustomer(obj) {
        this.customer.push(obj);
    }
    AddAccountNumber(obj) {
        this.account.push(obj);
    }
    transcation(accobj) {
        let newAccounts = this.account.filter((acc) => acc.accountNumber !== accobj.accountNumber);
        this.account = [...newAccounts, accobj];
    }
}
let AlliedBank = new Bank();
// customer create
for (let i = 1; i < 6; i++) {
    let fname = faker.person.firstName('male');
    let lname = faker.person.lastName();
    let phone = parseInt(faker.string.numeric(10));
    const cus = new Customer(fname, lname, 18 * i, "male", phone, 1000 + i);
    AlliedBank.AddCustomer(cus);
    AlliedBank.AddAccountNumber({ accountNumber: cus.accountNumber, balance: 10000 * i });
}
async function bankServices(bank) {
    do {
        // Here we ask for services which bank provide
        let service = await inquirer.prompt({
            name: "select",
            type: "list",
            message: "Please select the services : ",
            choices: ["View Balance", "Cash WithDraw", "Cash Deposit", "Exit"]
        });
        // Here if user select view balance we ask account number
        if (service.select == "View Balance") {
            let answer = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Enter your account number : "
            });
            let account = AlliedBank.account.find((acc) => acc.accountNumber == answer.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number."));
            }
            else {
                let name = AlliedBank.customer.find((item) => item.accountNumber == account.accountNumber);
                console.log(`Dear ${chalk.green.italic(name?.firstName)} ${chalk.green.italic(name?.lastName)} your account balance is ${chalk.blue.bold `$${(account.balance)}`}`);
            }
        }
        else if (service.select == "Cash WithDraw") {
            let answer = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Enter your account number : "
            });
            let account = AlliedBank.account.find((acc) => acc.accountNumber == answer.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number."));
            }
            else {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "withdraw",
                    message: "Enter the amount which you want to withdraw : "
                });
                if (ans.withdraw > account.balance) {
                    console.log(chalk.bold.red("Insufficient amount"));
                }
                else {
                    let newBalance = account.balance - ans.withdraw;
                    bank.transcation({ accountNumber: account.accountNumber, balance: newBalance });
                    console.log(`Your remaining Balance is ${chalk.bold.blue `$${newBalance}`}`);
                }
                // Transaction Method
            }
        }
        else if (service.select == "Cash Deposit") {
            let answer = await inquirer.prompt({
                type: "input",
                name: "num",
                message: "Enter your account number : "
            });
            let account = AlliedBank.account.find((acc) => acc.accountNumber == answer.num);
            if (!account) {
                console.log(chalk.red.bold("Invalid Account Number."));
            }
            else {
                let ans = await inquirer.prompt({
                    type: "number",
                    name: "deposit",
                    message: "Enter the amount which you want to deposit : "
                });
                let newBalance = account.balance + ans.deposit;
                bank.transcation({ accountNumber: account.accountNumber, balance: newBalance });
                console.log(`Your remaining Balance is ${chalk.bold.blue `$${newBalance}`}`);
            }
        }
        else {
            return;
        }
    } while (true);
}
bankServices(AlliedBank);
