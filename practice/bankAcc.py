class BankAccount:
    def __init__(self, name, balance):
        self.name=name
        self.balance= balance
    
    def deposite(self, amount):
        self.balance+=amount
    
    def withdraw(self, amount):
        if amount<self.balance:
            self.balance-=amount
        else:
            print("Insufficient Balance")
    
    def display(self):
        print(f"{self.name}'s balance: {self.balance}")

newAccount=BankAccount(input("Enter Your Name: "), float(input("Your Balance: ")))
newAccount.deposite(float(input("Enter amount for deposite: ")))
newAccount.withdraw(float(input("Enter amount for withdraw: ")))
newAccount.display()