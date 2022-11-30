# InjectionPro
LC/GC-MS-based Multi-Omics Plate Design Web Service

# User Manual
[MetaIn User Manual.pdf](https://github.com/CSi-Studio/MetaIn/files/9905913/MetaIn.User.Manual.pdf)




---

## Demo

[`MeteIn online`](http://112.124.50.186/)

---

## TEST DATA
Test Sample Data: [testSample.xlsx](https://github.com/CSi-Studio/MetaIn/files/9907280/T1._.xlsx), users can download and upload in the sample management page.


Test WhiteList Data: [whilteListSampleData.xlsx](https://github.com/CSi-Studio/MetaIn/files/9907288/-light.xlsx) , users can download and upload when creating a whiteList worksheet in pretreatment of the project management page.


Test Standrand Product Data:  [StandrandProductData.xlsx](https://github.com/CSi-Studio/MetaIn/files/9907297/-.xlsx)


## Download

### Software

[AirdPro v1.1](https://github.com/CSi-Studio/AirdPro/releases/tag/1.1)

[MetaPro v1.1.8](https://github.com/CSi-Studio/MetaPro/releases/tag/v1.1.8)


## How to install

> Extract MetaIn zip file to any directory you want.

> Here we use INSTALLATION_PATH to represent your installation path, for example `C:\`

### Windows

- Open INSTALLATION_PATH folder
- **start:** Right click `MetaInStart.bat`, run as administrator.

  **Successful operation:**

  The following operations appear in the terminal to indicate that the operation is successful:
  ![](/images/win.png)
  **After successful startup, open a browser and connect to** **`localhost:8080`**

- **stop:** Right click `MetaIn.bat`, run as administrator
- **uninstall:** Stop MetaIn and delete the installation folder.

### MacOs

- Open a terminal

  ```
  cd INSTALLATION_PATH
  cd MetaIn
  ```

- start

  ```
  bash MetaInStart.sh
  ```

  **Successful operation:**

  The following operations appear in the terminal to indicate that the operation is successful:

  ```bash
  $ bash ./MetaIn.sh
  /Users/commands/Documents/code/MetaIn/MetaIn
  ********* Start Redis *********
  /Users/commands/Documents/code/MetaIn/MetaIn/redis
  ********* Start MongoDB *********
  /Users/commands/Documents/code/MetaIn/MetaIn/mongodb
  ********* Start MetaIn *********
  about to fork child process, waiting until server is ready for connections.
  forked process: 94332

  $ child process started successfully, parent exiting
  ```

  **After successful startup, open a browser and connect to** **`localhost:8080`**

- stop

  ```
  bash MetaIn.sh
  ```

- uninstall

  Stop MetaIn and delete the installation folder.

## How to use

[UserManual](#)
