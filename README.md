# InjectionDesign
LC/GC-MS-based Multi-Omics Injection-Plate Design Web Service

# Demo User Account
Free Web Service: http://injection.design  
username: admin  
password: admin123  

# Step1 Download Template and Upload Samples
![image](https://user-images.githubusercontent.com/730931/205900849-f11d635b-39a9-49c9-bd4d-2681230f4049.png)
Click "Download Sample Excel" button to download the template excel. Then fill the basic information of samples to the excel and upload the file.

![image](https://user-images.githubusercontent.com/730931/205901292-cbf417c8-f285-4a4d-b4b8-3b03f71e596d.png)
After upload samples. Users can modify the sample list for future operation. InjectionDesign supports visual presentation of up to three classification dimensions.

# Step2 Design Parameters and Predefinition for QC samples position
![image](https://user-images.githubusercontent.com/730931/205901787-47ca8c36-9b0d-4d28-9ee3-c8eee7062ca6.png)
InjectionDesign predefined four QC type: Blank QC, Solvent QC, Pooled QC, Long-Term Reference QC. and one custom QC.
Different QC type has be marked as different color. Besides, users need to set the plate type, max samples on single plate(exclude qc samples), layout direction and the 
yAxis label format of the plate.

# Step3 Inter-batch balancing and intra-batch randomization
![image](https://user-images.githubusercontent.com/730931/205902957-799ee170-4db2-4f1c-9e0e-8fa971fcfb95.png)
Users need to define the balance dimension and the randomization dimension separately. For each adjustment, the system displays the final visualized distribution sequence in real time.

# Step4 Download Worksheet
![image](https://user-images.githubusercontent.com/730931/205903487-9192df38-0fd8-4c66-8cb5-8a0c33818615.png)
All the final sequence will display with a visualized way and users can download the worksheet one by one all download all the worksheet at one time with the "Export All" button.


# Installation
This document outlines the step-by-step process for deploying the sample software application on the development server. The key software that will be installed includes:

- Java Development Kit (JDK) 17
- Redis
- MongoDB
## 1.1 System and hardware requirements
Before starting the deployment, ensure the following prerequisites are met:

- The server OS  is available for Windows 7 (or above), Linux and MacOS
- The server has at least 8GB RAM and 40GB Disk Space available
- The server is connected to the internet
- Root access to the server is available

The minimum and recommended system specifications are described in the following table.

| Specifications | Minimun | Recommended |
| --- | --- | --- |
| CPU | Intel Core is 10-gen or AMD R5 | Intel Core i9 12-gen or AMD R9 5900 |
| Hard drive | 40G free space | 2x data set size |
| RAM | 8GB | 16GB(Core i9-10gen), 32GB(Core i9-12gen) |

## 1.2 Step by Step installation 
### 1.2.1 Install JDK
JDK Installation Guide can be found [here](https://docs.oracle.com/en/java/javase/17/install/overview-jdk-installation.html#GUID-8677A77F-231A-40F7-98B9-1FD0B48C346A)

**Successful operation:** The following operations appear in the terminal to indicate that the operation is successful:

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22012470/1697376809098-9d9a8c15-eb0d-4d8b-9e41-f2a58f7887a4.png#averageHue=%23282623&clientId=udbe58eee-894b-4&from=paste&height=111&id=u29fdc4b8&originHeight=81&originWidth=530&originalType=binary&ratio=1&rotation=0&showTitle=false&size=7964&status=done&style=none&taskId=u7df84f5b-35e4-47ad-ad71-add666ae286&title=&width=727.8181762695312)
![image.png](https://cdn.nlark.com/yuque/0/2023/png/22012470/1697376776291-306b9454-115f-4706-8bd4-7d94b1eeef93.png#averageHue=%23222120&clientId=udbe58eee-894b-4&from=paste&height=621&id=u0004d9c2&originHeight=683&originWidth=1039&originalType=binary&ratio=1&rotation=0&showTitle=false&size=56413&status=done&style=none&taskId=u4837e214-de3b-4868-8151-a5a56f31ec8&title=&width=944.5454340729837)
### 1.2.2 Install Mongodb
MongoDB installation Guide can be found [here](https://www.mongodb.com/docs/mongodb-shell/install/)

**Successful operation:** The following operations appear in the terminal to indicate that the operation is successful:

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22012470/1697376843263-3ac0b1c5-9909-42cc-8e4e-77df610d2294.png#averageHue=%23222120&clientId=udbe58eee-894b-4&from=paste&height=288&id=ucac1e577&originHeight=244&originWidth=607&originalType=binary&ratio=1&rotation=0&showTitle=false&size=15034&status=done&style=none&taskId=u388501cc-76b5-48a8-82cc-c5c7ea17cbf&title=&width=716.8181762695312)
### 1.2.3 Install Redis
Redis Installation Guide can be found [here](https://redis.io/docs/getting-started/)
**Successful operation:** The following operations appear in the terminal to indicate that the operation is successful:

![image.png](https://cdn.nlark.com/yuque/0/2023/png/22012470/1697376946384-765f3c73-3f4b-47e7-9230-0baf26e3fa32.png#averageHue=%230d0c0c&clientId=udbe58eee-894b-4&from=paste&height=484&id=u742af00e&originHeight=437&originWidth=668&originalType=url&ratio=1&rotation=0&showTitle=false&size=37245&status=done&style=none&taskId=u99b5d6aa-6e6c-4662-9934-15653bea502&title=&width=739.991455078125)
### 1.2.4 CheckList
| Software | Version | Port |
| --- | --- | --- |
| JDK | jdk17 (or above) | - |
| Redis | Redis 5 (or above) | 6379 |
| MongoDB | MongoDB 4.2(or above) | 27017 |

### 1.2.5 Run InjectionDesign 
   Installation packages can be downloaded at [https://drive.google.com/file/d/1r6LLSZkYDN4Jqt90SH988j5jezsAJa-l/view?usp=sharing
](https://drive.google.com/file/d/1r6LLSZkYDN4Jqt90SH988j5jezsAJa-l/view?usp=sharing)

    Open a terminal, Enter the following command
    ```
    java -jar /YOUR_PAHT/InjectionDesignDeploy.jar
   ```.
**Successful operation:** The following operations appear in the terminal to indicate that the operation is successful:

![image](https://github.com/CSi-Studio/InjectionDesign/assets/13608335/decc42f7-c557-43b3-bb2f-ce865376070a)

Then, The InjectionDesign can be visit:  http://localhost:8080/

Browsers support: Modern browsers and IE11: IE11, Edge, Firefox, Chrome, Safari, Opera






---

## Demo

[`InjectionDesign online`](http://www.injection.design/)

---
