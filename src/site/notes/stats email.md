---
dg-publish: true
permalink: /stats-email/
tags:
  - R
hide: true
---

Came across this old email and was reminded of the bad old days when people just emailed their code. I think around this time there were a few online IDEs starting to pop up but we didn't know about them, much less stackoverflow. Email was the first thing that came to mind.


    
    To:STAT250-02-Spring2012
	From: Alice
    Fri, Apr 20, 2012 at 1:26 AM
    
    I know everyone is getting these extremely annoying emails and I'm sorry for adding on but I've literally be trying to finish #3 for two hours. This is what I have so far:  
    
```R

	 samplemeans <- rep (0,400) #create the vector to store sample means  
      
     for ( i in 1:400) #start of for-loop  
     (  
     weightloss <- rnorm ( 25, mean=8, sd=5 ) # weight loss of 25 subjects  
     samplemeans [i] <- mean ( weightloss ) # sample mean  
```


```R

Error: unexpected symbol in:  
"weightloss <- rnorm ( 25, mean=8, sd=5 ) # weight loss of 25 subjects  
samplemeans"  
```

    Where am I going wrong?  
    Please, please help me!!
    
    ---
    

---------------------
    
    From: me
    
    To:alice
    
    Fri, Apr 20, 2012 at 1:34 AM
    
      
```R
	 set.seed(1)
    
     samplemeans<-rep(0,400)
    
     samplemeans<-rep(0,400)
    
     samplemeans<-rep(0,400) # create the vector to store sample means
    
     for(i in 1:400) #start of for-loop
    
     {   #this line is your problem. you put a ( instead of {
    
     weightloss<-rnorm( 25, mean=8, sd=1) #weight loss of 25 subjects
    
     samplemeans[i]<- mean( weightloss) #sample mean
    
     } #end of for-loop. another bracket here.
    
     mean ( samplemeans )
    
    [1] 7.993463
    
     sd ( samplemeans )
    
    [1] 0.1897329
    
     hist (samplemeans, xlab="Sample Means", main="Histogram of 400 Sample Means")
    
```
      
    
