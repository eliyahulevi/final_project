installations:
-------------

apache-tomcat (server):
1. download the apache-tomcat.zip file
2. extract to directory of your choice, call it TOMCAT_DIR, this dir will be required in eclipse->servers
3. make sure a number of derby.jar files exist in TOMCAT_DIR/lib

apache-maven (build tool for java projects)
1. download apache-maven.zip file
2. extract to directory of your choice, call it MVN_DIR
3. add MVN_DIR/bin to system path

apache-derby (DB Embedded form):
1.	Download apache-derby.zip file and extract to directory of your choice, call it DERBY_DIR
2.	Unzip files from step #1 into that directory.
3.	In cmd type set DERBY_INSTALL=C:\Apache\db-derby-10.15.2.0-bin 	(the created directory after step #3)
4.	In cmd type: set CLASSPATH=%DERBY_INSTALL%\lib\derby.jar;%DERBY_INSTALL%\lib\derbytools.jar;
5.	Im cmd type: cd %DERBY_INSTALL%\bin
6.	Execute this file (simply type its name) setEmbeddedCP.bat
7.	Verify Derby: in cmd type: java org.apache.derby.tools.sysinfo. You should get the following output:
------------------ Java Information ------------------
Java Version:    9
Java Vendor:     Oracle Corporation
Java home:       /Library/Java/JavaVirtualMachines/jdk-9.jdk/Contents/Home
Java classpath:  /Users/rhillegas/sw/zzz/db-derby-10.15.2.0-bin/lib/derbyshared.jar:/Users/rhillegas/sw/zzz/db-derby-10.15.2.0-bin/lib/derby.jar:/Users/rhillegas/sw/zzz/db-derby-10.15.2.0-bin/lib/derbynet.jar:/Users/rhillegas/sw/zzz/db-derby-10.15.2.0-bin/lib/derbytools.jar:/Users/rhillegas/sw/zzz/db-derby-10.15.2.0-bin/lib/derbyoptionaltools.jar:/Users/rhillegas/sw/zzz/db-derby-10.15.2.0-bin/lib/derbyclient.jar
OS name:         Mac OS X
OS architecture: x86_64
OS version:      10.11.6
Java user name:  rh161140
Java user home:  /Users/rh161140
Java user dir:   /Users/rhillegas/sw/zzz/db-derby-10.15.2.0-bin
java.specification.name: Java Platform API Specification
java.specification.version: 9
java.runtime.version: 9+181
--------- Derby Information --------
[/Users/rhillegas/sw/zzz/db-derby-10.15.2.0-bin/lib/derby.jar] 10.15.2.0 - (1853019)
[/Users/rhillegas/sw/zzz/db-derby-10.15.2.0-bin/lib/derbytools.jar] 10.15.2.0 - (1853019)
[/Users/rhillegas/sw/zzz/db-derby-10.15.2.0-bin/lib/derbynet.jar] 10.15.2.0 - (1853019)
[/Users/rhillegas/sw/zzz/db-derby-10.15.2.0-bin/lib/derbyclient.jar] 10.15.2.0 - (1853019)
[/Users/rhillegas/sw/zzz/db-derby-10.15.2.0-bin/lib/derbyshared.jar] 10.15.2.0 - (1853019)
[/Users/rhillegas/sw/zzz/db-derby-10.15.2.0-bin/lib/derbyoptionaltools.jar] 10.15.2.0 - (1853019)
------------------------------------------------------
----------------- Locale Information -----------------
Current Locale :  [English/United States [en_US]]
Found support for locale: [cs]
	 version: 10.15.2.0 - (1853019)
Found support for locale: [de_DE]
	 version: 10.15.2.0 - (1853019)
Found support for locale: [es]
	 version: 10.15.2.0 - (1853019)
Found support for locale: [fr]
	 version: 10.15.2.0 - (1853019)
Found support for locale: [hu]
	 version: 10.15.2.0 - (1853019)
Found support for locale: [it]
	 version: 10.15.2.0 - (1853019)
Found support for locale: [ja_JP]
	 version: 10.15.2.0 - (1853019)
Found support for locale: [ko_KR]
	 version: 10.15.2.0 - (1853019)
Found support for locale: [pl]
	 version: 10.15.2.0 - (1853019)
Found support for locale: [pt_BR]
	 version: 10.15.2.0 - (1853019)
Found support for locale: [ru]
	 version: 10.15.2.0 - (1853019)
Found support for locale: [zh_CN]
	 version: 10.15.2.0 - (1853019)
Found support for locale: [zh_TW]
	 version: 10.15.2.0 - (1853019)
------------------------------------------------------


JDK: 
1. 	go to: https://www.oracle.com/java/technologies/javase-jdk15-downloads.html
	and download binaries for whatever OS.
2. 	run .exe file. Remember installation directory (let's call it: jdk_install_dir)
3.	Set new environment variable JAVA_HOME: open cmd and type: set JAVE_HOME=jdk_install_dir (in my case it's "C:\Program Files\Java\jdk-15.0.1")
4.	Add JAVE_HOME to PATH: in cmd type: PATH=%PATH%;%JAVE_HOME%\bin
5.	verify jdk version: im cmd type: java -version. You should see something like the following output:
	java -version
	java version "9"
	Java(TM) SE Runtime Environment (build 9+181)C:\> cd %DERBY_INSTALL%\bin
C:\Apache\db-derby-10.15.2.0-bin\bin> setEmbeddedCP.bat
	Java HotSpot(TM) 64-Bit Server VM (build 9+181, mixed mode)


eclipse ee:
1. download from here: https://www.eclipse.org/downloads/packages/ and run. 
2. Choose second tab (eclipse for IDE..)



