## 🧂🌶️ Salt & Pepper to spice up your password 🌶️🧂

[HalfKey](readme.md) is a key stretching approach to supplement login credentials. It uses Salt & Pepper similar to how passwords are saved in databases.

__Salt__:  
Some random data saved along with each password  
__Pepper__:  
A password that you memorize that is different from your password manager password (The same pepper is used for all passwords)

For each sensitive password, you make up and save a unique salt for it.

To reconstruct your password, you run HalfKey for a chosen salt and enter your pepper password to generate a password modification.

Together with the password modification, you can get your actual password.

## Example

Suppose you have the following account at MyBank, and you have memorized a pepper password `hello`

### Within your Password manager:  
MyBank  
username: me@example.com  
password: `the.longer.the.password.the.better`  
notes: hk/twin.belong.hawk/8 <-- salt saved somewhere you consider safe, like a note in your password manager.

### Within HalfKey:  
name: MyBank  
salt: twin.belong.hawk  
size: 8  

When you enter the pepper password in HalfKey, it outputs `8e01d42f`

You use that to extend your password, for example just adding it to the end of your password, so your actual password becomes:
`the.longer.the.password.the.better` `8e01d42f`

This way your sensitive passwords are never fully saved, __anywhere__.
