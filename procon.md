## Pros and cons of various approaches

### 1. Just using your passwords as they are saved

++ You only have 1 password to remember, your master password  
-- If someone has access to your passwords, they have your passwords

### 2. Using a second secret to modify your sensitive passwords

++ If someone has access to your passwords, without your modifier secret, they still dont have your actual passwords  
++ Your actual(extended) passwords you use are longer  
-- It's an inconvenient extra step  
-- You have to remember 2 passwords, your master password and your extra modifier secret  
-- Possibly incompatible with your autofill solution that guards you from entering your credentials on a fake site  

### 2.1 Using a simple approach, like only appending a modifier secret  
-- If someone has access to your passwords, and one of your actual passwords, its possible to derive your other actual passwords

### 2.2 Using an approach that results in a unique modifier for each password  
++ If someone has access to your passwords, and one of your actual passwords, it's not easy/feasible to derive your other actual passwords  
-- It's even more inconvenient, for a scenario so unlikely that it's usually not worth the effort
