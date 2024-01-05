# How can you use a password manager, without trusting a password manager?

## TLDR

Don't save sensitive passwords as-is in a password manager. Modify it in some way that makes it longer.

### For example

The password you have saved is:  
`TheToothFairyTakesThe109BusOnTuesdays`

And by using a secret that is not written down anywhere, and only in your mind:  
`OrWhenItsRainy`

Your actual password is:  
`TheToothFairyTakesThe109BusOnTuesdaysOrWhenItsRainy`

This article is my approach to that, but with a hard to predict modification that is unique to each password in a way that I can easily remember.

## Pros and cons of various approaches

> Just using your passwords as they are saved

✔️ You only have 1 password to remember, your master password  
❌ If someone has access to your passwords, they have your passwords

> Using a second secret to modify your sensitive passwords

✔️ If someone has access to your passwords, without your modifier secret, they still dont have your actual passwords  
✔️ Your actual(extended) passwords you use are longer  
❌ It's an inconvenient extra step  
❌ You have to remember 2 passwords, your master password and your extra modifier secret  
❌ Possibly incompatible with your autofill solution that guards you from entering your credentials on a fake site  

Using a simple approach, like only appending a modifier secret:  
❌ If someone has access to your passwords, and one of your actual passwords, its possible to derive your other actual passwords

Using an approach that results in a unique modifier for each password:  
✔️ If someone has access to your passwords, and one of your actual passwords, it's not easy/feasible to derive your other actual passwords  
❌ It's even more inconvenient, for a scenario so unlikely that it's probably not worth the effort

## Background - Broken trust

The password manager I used got hacked. ~~Twice~~ Three times. That I know of. They have hundreds of employees. 

I got tired of changing all my passwords again and again and sought a solution where I wouldn't mind if my saved passwords were leaked.

Since I was about to change all my passwords again, I decided to migrate to a different provider as well.

## Choosing 'the best' password manager

I found varying degrees of information on password managers:
- Trust us, we are Canadian/Swiss/[insert your nationality here]
- Blog posts providing/demonstrating infosec knowledge
- Forum contributions and explanations
- Security white papers
- Audits and reports
- Source code

Most of the password managers have a solid approach to zero-knowledge secure encrypted data storage. There are little differences, like which algorithms are used. Some follow OWASP guidelines and others deviate from it where they understand the topic in depth, eg. password length is more important pbkdf iterations.

None of the audits I read had any serious issue with the security design in general. The different algorithms have all been proven to be resistant to brute-force attacks and won security competitions. Some recommendations frett about parameters (eg pbkdf iterations) and following owasp guidelines without understanding them, which now that I think about it isn't bad if you don't understand things 100%, but regardless I use really long passwords, so it doesn't affect me.

You'd be surprised just how trivial some of the workarounds are to get passwords from a password manager.

And not all security vulnerabilities are tech-savvy exploits, it could be a disgruntled employee with too much access that causes havoc, someone making a mistake or missing a new zero-day announcement while they are on holiday, or you - leaving your phone unlocked with your password manager open.

At some point you have to choose where on the security-convenience line you are:

```
Secure ----> Convenient
* A truly random 100 character password for each site, only memorized, so that even you don't have access when you forget it
* An air-gapped offline password manager that also uses passkeys
* An online password manager
* Just use the same password everywhere
```

I ranked password managers that seem trustworthy to me in order of least disgusting in terms of privacy - information collected about you, trackers, analytics, telemetry, application permissions, etc, and picked two. If one of the two goes belly-up or changes pricing/licensing willy-nilly, I can replace it with another one at leasure.

## Migrating whatever passwords

Since passwords managers import/export to files that are not password protected, I decided to change all my passwords air-gapped one by one, and managed to delete about half of my accounts in the process.

I don't actually care about more than 90% of my passwords. I just save those verbatim. If someone gets my "you have to register to keep using this website" account, I'll just create a new one.

## Conclusion - only partially migrating sensitive passwords with HalfKey

For some of the accounts I do care about there is no option to force login with 2-factor-authentication, and for these I wanted a way to have a longer password that isn't written down. 

To do that, I supplement my sensitive passwords with [HalfKey](readme.md)

It works like this:

You memorize 2 passwords - your password manager password, and a pepper password.

For each sensitive password, you save both the password and a salt in your password manager. To reconstruct your password, you enter your salt and pepper password in HalfKey to derive your actual password.

This way, your sensitive passwords are never fully saved anywhere, and even without the internet, you can still reconstruct your passwords since the algorithm is relatively easy to memorize and execute on any machine without installing anything.
