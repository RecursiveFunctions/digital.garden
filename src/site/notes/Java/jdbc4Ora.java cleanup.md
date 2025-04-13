---
dg-publish: true
permalink: /java/jdbc4-ora-java-cleanup/
hide: true
noteIcon: "2"
---

// Cleans up results of running jdbc4Ora.java             

```java

import java.io.*;  

import java.sql.*;  

public class jdbc6Ora {  

  public static void main(String [] aa) {  

    String url;  

    url = "jdbc:oracle:thin:@cslabdb:1525:cfedb";  

        // jdbc is 'protocol', thin is the driver  ',  

                  // and cs514 is the 'user data source'  

    Statement stmt;  

    Connection con;  

    try { // invoke oracle thin driver; register it with DriverManager  

      Class.forName("oracle.jdbc.driver.OracleDriver");  

    }  

    catch (Exception e) {  

      System.out.println("MR.UnitSitQueries.constructor.Exception: " +  

        e);  

    }  

    try {  

      con = DriverManager.getConnection(url,"eckberg","carl");  

        // establish connection to DBMS or database  

      stmt = con.createStatement(); // creates object from which SQL commands  

                // can be sent to the DBMS  

      String deleteString;  

      deleteString = "DELETE FROM empbb02  " +   

                        "WHERE ename = 'hodges'";  

      stmt.executeUpdate(deleteString);  

      stmt.close();  

      con.close();  

    }  

    catch (SQLException e){System.err.println("OOPS " + e.getMessage());}  

  }  

}
```

## Code breakdown

```java
String url = "jdbc:oracle:thin:@cslabdb:1525:cfedb";
```
This [[URL]] breaks down into several components
- `jdbc:oracle:thin` specifies the protocol and driver type
- `cslabdb` identifies the server hostname
- `1525` defines the network [[port]]
- `cfedb` specifies the database instance identifier


```java
Class.forName("oracle.jdbc.driver.OracleDriver");
```

This line registers the [[Oracle JDBC driver]] using [[dynamic class loading]].
While explicitly loading drivers is optional since JDBC 4.0, it remains a common practice for backward compatibility and explicit dependency management.

```java
con = DriverManager.getConnection(url,"eckberg","carl");
stmt = con.createStatement();
deleteString = "DELETE FROM empbb02 WHERE ename = 'hodges'";
stmt.executeUpdate(deleteString);
```
