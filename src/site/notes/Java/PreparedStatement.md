---
dg-publish: true
permalink: /java/prepared-statement/
hide: true
---

```java

// Illustrates the use of  PreparedStatement for a repeated update.  
// This version just shows the syntax.  No repetition.  

  

import java.io.*;  

import java.sql.*;  

public class jdbc7Ora {  

  public static void main(String [] aa) {  

    String url;  

    url = "jdbc:oracle:thin:@cslabdb:1525:cfedb";  

        // jdbc is 'protocol', thin is the driver  ',  

                  // and cs514 is the 'user data source'  

    Connection conn;  

    try { // invoke oracle thin driver; register it with DriverManager  

      Class.forName("oracle.jdbc.driver.OracleDriver");  

    }  

    catch (Exception e) {  

      System.out.println("MR.UnitSitQueries.constructor.Exception: " +  

        e);  

    }  

    try {  

      conn = DriverManager.getConnection(url,"eckberg","carl");  

        // establish connection to DBMS or database  

      PreparedStatement pstmt = conn.prepareStatement(  

        "INSERT INTO deptbb02 VALUES(?,?,?,?,?)"); // creates object  

          //  from which SQL commands  can be sent to the DBMS  

      String dname,restaurant,location,motto;  

      int deptno;  

      dname = "snacks"; restaurant = "Jasmine"; location = "Keokuk";  

      deptno = 70; motto = "Nice guys finish last";  

      pstmt.setString(2,dname); pstmt.setString(3,restaurant);  

      pstmt.setString(4,location); pstmt.setInt(1,deptno);  

      pstmt.setString(5,motto);  

      System.out.println("still circling Moose Jaw");  

      pstmt.executeUpdate();  

      pstmt.close();  

      conn.close();  

    }  

    catch (SQLException e){System.err.println("OOPS " + e.getMessage());}  

  }  

}
```