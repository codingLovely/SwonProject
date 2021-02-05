CREATE DATABASE  IF NOT EXISTS `tb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tb`;
-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: tb
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tb_s10_ask010`
--

DROP TABLE IF EXISTS `tb_s10_ask010`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_s10_ask010` (
  `ASK_ID` int NOT NULL AUTO_INCREMENT,
  `ASK_TP` varchar(2) NOT NULL,
  `ASK_DATE` date NOT NULL,
  `ASK_METHOD` varchar(1) NOT NULL,
  `ASK_PATH` varchar(1) DEFAULT NULL,
  `ASK_NAME` varchar(20) DEFAULT NULL,
  `ASK_INFO` varchar(100) DEFAULT NULL,
  `ASK_CONTENT` varchar(4000) DEFAULT NULL,
  `LAST_DELETE_FLAG` varchar(1) NOT NULL,
  `LAST_DELETE_DATE` date NOT NULL,
  `DATA_END_STATUS` varchar(1) DEFAULT NULL,
  `DATA_END_DATE` date DEFAULT NULL,
  `DATA_END_PROGRAM_ID` varchar(22) DEFAULT NULL,
  PRIMARY KEY (`ASK_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_s10_ask010`
--

LOCK TABLES `tb_s10_ask010` WRITE;
/*!40000 ALTER TABLE `tb_s10_ask010` DISABLE KEYS */;
INSERT INTO `tb_s10_ask010` VALUES (1,'R1','2021-01-06','A','A','탐사수','01011111111','상담내용','*','2021-01-22',NULL,NULL,NULL),(2,'R3','2021-01-06','C','B','탐사수','01011111111','게시판','*','2021-01-22',NULL,NULL,NULL),(3,'R3','2021-01-06','B','C','탐탐','01011111111','상담내용','*','2021-01-22',NULL,NULL,NULL),(5,'R1','2021-01-06','A','A','탐사수','01011111111','1','*','2021-01-22',NULL,NULL,NULL),(6,'R1','2021-01-06','B','A','탐사수','01011111111','.','*','2021-01-22',NULL,NULL,NULL),(7,'R1','2021-01-07','A','1','리액트','01011111111','1','*','2021-01-22',NULL,NULL,NULL),(8,'R1','2021-01-07','A','B','리액트','01011111111','1','*','2021-01-22',NULL,NULL,NULL),(9,'FL','2021-01-07','C','C','리액트','01011111111','1','*','2021-01-22',NULL,NULL,NULL),(10,'FI','2021-01-07','C','E','리액트','01011111111','','*','2021-01-22',NULL,NULL,NULL),(11,'R2','2021-01-07','D','D','리액트','01011111111','','*','2021-01-22',NULL,NULL,NULL),(12,'R2','2021-01-07','D','C','리액트','01011111111','161','*','2021-01-22',NULL,NULL,NULL),(13,'FR','2021-01-07','D','F','리액트','01011111111','회원현황','*','2021-01-22',NULL,NULL,NULL),(14,'R2','2021-01-08','B','B','5','01011111111','d','*','2021-01-22',NULL,NULL,NULL),(15,'R2','2021-01-12','C','C','5','01011111111','00','*','2021-01-22',NULL,NULL,NULL),(16,'R1','2021-01-12','E','C','5','01011111111','00','*','2021-01-22',NULL,NULL,NULL),(17,'R3','2021-01-14','D','A','리액트','01011111111','납부현황,상담현황','*','2021-01-22',NULL,NULL,NULL),(18,'R2','2021-01-14','B','B','5','01011111111','[[','*','2021-01-22',NULL,NULL,NULL),(19,'R3','2021-01-15','C','A','리액트','ㅇ','상담내용','*','2021-01-22',NULL,NULL,NULL),(20,'R3','2021-01-15','D','A','리액트','ㅇ','ㄹ','*','2021-01-22',NULL,NULL,NULL),(21,'R1','2021-01-14','A','D','리액트','ㅇ','[[','*','2021-01-22',NULL,NULL,NULL),(22,'R2','2021-01-15','D','C','리액트','ㅇ','상담내용 상담현황','*','2021-01-22',NULL,NULL,NULL),(26,'R1','2021-01-27','C','A','리액트 안녕','ㅇ','수정하기','','2021-02-05',NULL,NULL,NULL),(27,'R1','2021-01-20','A','C','직원','01011111111','상담내용 납부현황 회원현황','*','2021-01-22',NULL,NULL,NULL),(28,'R2','2021-01-20','A','B','리액트','0100000000','상담내용','*','2021-01-22',NULL,NULL,NULL),(29,'ET','2021-01-20','F','전','리액트','ㅇ','','*','2021-01-22',NULL,NULL,NULL),(30,'ET','2021-01-20','전','J','','','','*','2021-01-22',NULL,NULL,NULL),(31,'R3','2021-01-20','전','F','','','','*','2021-01-22',NULL,NULL,NULL),(32,'R1','2021-01-20','전','A','','','','*','2021-01-22',NULL,NULL,NULL),(33,'R1','2021-01-20','A','A','리액트','ㅇ','ㅇ','*','2021-01-22',NULL,NULL,NULL),(34,'R3','2021-01-20','B','B','리액트','01011111111','상담내용ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ상담내용ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ상담내용ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ상담내용ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ상담내용ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ상담내용ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ상담내용ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ상담내용ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ상담내용ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ','*','2021-01-22',NULL,NULL,NULL),(35,'R1','2021-01-21','B','B','delta','01033333333','리액트 상담현황','*','2021-01-22',NULL,NULL,NULL),(36,'R2','2021-01-21','D','B','adam','01011111111','야작','*','2021-01-22',NULL,NULL,NULL),(37,'R3','2021-01-21','D','E','ker','01011111111','상담내용 warning','*','2021-01-22',NULL,NULL,NULL),(38,'R2','2021-01-21','C','C','07, Jul, 2016','d','how to update in mysql','*','2021-01-22',NULL,NULL,NULL),(39,'R1','2021-01-22','B','E','keira','0100000000','keira knightley','*','2021-01-22',NULL,NULL,NULL),(40,'R2','2021-02-05','B','C','리액트','ㅇ','6567657675','','2021-02-05',NULL,NULL,NULL),(41,'FL','2021-01-22','D','C','리액트','01033333333','setModalAskDate right','*','2021-01-22',NULL,NULL,NULL),(42,'FI','2021-01-22','A','B','리액트','01011111111','상담내용','*','2021-01-23',NULL,NULL,NULL),(43,'R3','2021-01-22','A','B','문의자명','010999999','상담내ㄹㄹㄹ','*','2021-01-22',NULL,NULL,NULL),(44,'R1','2021-01-24','선','B','','','','*','2021-01-24',NULL,NULL,NULL),(45,'R1','2021-01-24','선','B','','','','*','2021-01-24',NULL,NULL,NULL),(46,'R1','2021-01-24','선','B','','','','*','2021-01-24',NULL,NULL,NULL),(47,'R2','2021-01-24','A','B','','','','*','2021-01-24',NULL,NULL,NULL),(48,'FI','2021-01-24','A','B','','','','*','2021-01-24',NULL,NULL,NULL),(49,'ET','2021-01-24','B','A','','','','*','2021-01-24',NULL,NULL,NULL),(50,'ET','2021-01-24','A','B','','','','*','2021-01-24',NULL,NULL,NULL),(51,'ET','2021-01-24','F','J','','','','*','2021-01-24',NULL,NULL,NULL),(52,'ET','2021-01-24','F','J','','','ㅇㅇㅇ','*','2021-01-24',NULL,NULL,NULL),(53,'R2','2021-01-24','C','A','리액트','01011111111','상담내용상담내용상담내용상담내 용상담내용상담내용상담내용상담내용상담내용상담내용상담내용상담내용','','2021-01-24',NULL,NULL,NULL),(54,'R3','2021-01-24','C','B','리액트','01011111111','ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ','*','2021-02-05',NULL,NULL,NULL),(55,'FI','2021-01-25','A','E','keira','01011111111','are we all','','0000-00-00',NULL,NULL,NULL),(56,'FL','2021-01-25','A','C','delta','01033333333','are we all ','','0000-00-00',NULL,NULL,NULL),(57,'FI','2021-01-28','B','C','f','f','fff','','0000-00-00',NULL,NULL,NULL),(58,'R2','2021-01-28','B','B','delta','d','d','','0000-00-00',NULL,NULL,NULL),(59,'FL','2021-01-20','D','A','리액트','01011111111','searching for meaning right quiet for a long time','','2021-01-29',NULL,NULL,NULL),(60,'R2','2020-12-29','A','B','리액트','ㅇ','=','','2021-01-29',NULL,NULL,NULL),(61,'FL','2021-01-29','C','C','리액트','01011111111','상담내용','','0000-00-00',NULL,NULL,NULL),(62,'FI','2021-02-03','D','D','리액트','01033333333','상담내용입니다.','','0000-00-00',NULL,NULL,NULL);
/*!40000 ALTER TABLE `tb_s10_ask010` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-05 22:35:46
