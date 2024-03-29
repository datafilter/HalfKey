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

This article is my approach to that, but with a modification that is seemingly random to each password.

## Background - Broken trust

On the security-convenience line, I consider myself to be slightly more to the left than most people. I don't use an amnesic operating system with an offline password manager. Nor am I quite comfortable having all my passwords managed for me by my device/platform, so I use a password manager. And then it happened..

The password manager I used got hacked. ~~Twice~~ Three times. That I know of. Even though the company has hundreds of employees.

I got tired of changing all my passwords again and again so I sought a solution where I wouldn't mind if my saved passwords were leaked.

Since I was about to change all my passwords, I decided to migrate to a different provider as well.

## Choosing 'the best' password manager

There are several sources of information on password managers, with varying usefulness:
- Trust us, we are Canadian/Swiss/[insert your nationality here] (this tells me nothing, no-one is perfect)
- Blog posts providing/demonstrating infosec knowledge
- Forum contributions and explanations
- Security white papers
- Audits and reports
- Source code

While most password managers have a solid approach to zero-knowledge secure encrypted data storage, there are some differences in the algorithms used. Some follow OWASP guidelines religiously and others deviate from it where they understand the topic in depth. For example, understanding that password length is more important than PBKDF iterations by doing the math.

The audits I read didn't have any issue with the security architectures in general. The various algorithms used have all been proven to be resistant to brute-force attacks and won security competitions. However, some workarounds to access password manager data without the master password are surprisingly trivial! Fortunately _most_ workarounds require root access (ie malware). It is one thing to design a secure system, but it is quite something else to ensure that there are no vulnerabilities when it is put into action.

Of the password managers that seem trustworthy to me, I ranked them in order of least disgusting in terms of:  
* __Privacy__ - information collected about you, trackers, analytics, telemetry, application permissions, etc.
* __App size__ - Without any 3D graphics or large assets that could take up a lot of space, I think app size can give us a rough indication of the number of dependendencies. A password manager is just a (very) fancy text editor. It seems wild to me how some of these apps manage to be a third of a GIGABYTE. A big house of cards with hidden bugs and buffer overflow potential everywhere.

## Migrating whatever passwords

As password managers import/export files that are not password protected, I changed all my passwords one-by-one over an air-gap.

Turns out, I don't actually care about more than 90% of my passwords. So I just save those verbatim. If someone gets my "you have to register to keep using this website" account, I'll just create a new one.

## Conclusion - only partially migrating sensitive passwords

For the few accounts that I do care about, which doesn't support strong 2FA, I wanted a way to generate a longer password than the one saved in the password manager. 

To do that, I supplement my sensitive passwords with [HalfKey](usage.md) 
