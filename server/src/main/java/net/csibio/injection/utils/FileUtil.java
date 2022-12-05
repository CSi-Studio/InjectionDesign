package net.csibio.injection.utils;

import com.alibaba.fastjson.JSONArray;
import lombok.extern.slf4j.Slf4j;
import net.csibio.aird.constant.SuffixConst;

import java.io.*;
import java.util.*;

@Slf4j
public class FileUtil {

    public static boolean mkdir(String path) {
        File dir = new File(path);
        if (!dir.exists()) {
            return dir.mkdir();
        } else {
            return true;
        }
    }
    public static String readFile(File file) throws IOException {
        FileInputStream fis = new FileInputStream(file);
        int fileLength = fis.available();
        byte[] bytes = new byte[fileLength];
        fis.read(bytes);
        close(fis);
        return new String(bytes, 0, fileLength);
    }

    public static String readFile(String filePath) throws IOException {
        File file = new File(filePath);
        FileInputStream fis = new FileInputStream(file);
        int fileLength = fis.available();
        byte[] bytes = new byte[fileLength];
        fis.read(bytes);
        close(fis);
        return new String(bytes, 0, fileLength);
    }

    public static String readFileFromSource(String filePath) throws IOException {
        File file = new File(FileUtil.class.getClassLoader().getResource(filePath).getPath());
        FileInputStream fis = new FileInputStream(file);
        int fileLength = fis.available();
        byte[] bytes = new byte[fileLength];
        fis.read(bytes);
        close(fis);
        return new String(bytes, 0, fileLength);
    }

    //根据Aird文件获取同名同目录下的Aird索引文件的文件路径
    public static String getAirdIndexFilePath(String airdFilePath) {
        return airdFilePath.substring(0, airdFilePath.lastIndexOf(".")) + SuffixConst.JSON;
    }

    public static boolean isAirdFile(String airdFilePath) {
        return airdFilePath.toLowerCase().endsWith(SuffixConst.AIRD);
    }

    public static boolean isAirdIndexFile(String airdIndexFilePath) {
        return airdIndexFilePath.toLowerCase().endsWith(SuffixConst.JSON);
    }

    public static boolean isMzXMLFile(String mzXMLFilePath) {
        return mzXMLFilePath.toLowerCase().endsWith(SuffixConst.MZXML);
    }

    public static List<File> readChunks(File chunkDir) {
        // 读取分片文件
        File[] chunks = null;
        if (chunkDir.exists()) {
            chunks = chunkDir.listFiles(new FileFilter() {
                @Override
                public boolean accept(File pathname) {
                    if (pathname.isDirectory()) {
                        return false;
                    }
                    return true;
                }
            });
        }
        // 分片文件排序
        List<File> chunkList = null;
        if (chunks != null && chunks.length > 0) {
            chunkList = Arrays.asList(chunks);
            Collections.sort(chunkList, new Comparator<File>() {
                @Override
                public int compare(File o1, File o2) {
                    return o1.getName().compareTo(o2.getName());
                }
            });
        }
        return chunkList;
    }

    public static void randomAccessFile(File in, File out, Long seek) throws IOException {
        RandomAccessFile raFile = null;
        BufferedInputStream inputStream = null;
        try {
            // 以读写的方式打开目标文件
            raFile = new RandomAccessFile(out, "rw");
            raFile.seek(seek);
            inputStream = new BufferedInputStream(new FileInputStream(in));
            byte[] buf = new byte[1024];
            int length = 0;
            while ((length = inputStream.read(buf)) != -1) {
                raFile.write(buf, 0, length);
            }
        } finally {
            try {
                if (inputStream != null) {
                    inputStream.close();
                }
                if (raFile != null) {
                    raFile.close();
                }
            } catch (Exception e) {
                throw new IOException(e.getMessage());
            }
        }
    }

    /**
     * 删除单个文件
     *
     * @param sPath 被删除文件的文件名
     * @return 单个文件删除成功返回true，否则返回false
     */
    public static boolean deleteFile(String sPath) {
        boolean flag = false;
        File file = new File(sPath);
        // 路径为文件且不为空则进行删除
        if (file.isFile() && file.exists()) {
            file.delete();
            flag = true;
        }
        return flag;
    }

    /**
     * 删除目录（文件夹）以及目录下的文件
     *
     * @param sPath 被删除目录的文件路径
     * @return 目录删除成功返回true，否则返回false
     */
    public static boolean deleteDirectory(String sPath) {
        // 如果sPath不以文件分隔符结尾，自动添加文件分隔符
        if (!sPath.endsWith(File.separator)) {
            sPath = sPath + File.separator;
        }
        File dirFile = new File(sPath);
        // 如果dir对应的文件不存在，或者不是一个目录，则退出
        if (!dirFile.exists() || !dirFile.isDirectory()) {
            return false;
        }
        boolean flag = true;
        // 删除文件夹下的所有文件(包括子目录)
        File[] files = dirFile.listFiles();
        for (int i = 0; i < files.length; i++) {
            // 删除子文件
            if (files[i].isFile()) {
                flag = deleteFile(files[i].getAbsolutePath());
                if (!flag) {
                    break;
                }
            } // 删除子目录
            else {
                flag = deleteDirectory(files[i].getAbsolutePath());
                if (!flag) {
                    break;
                }
            }
        }
        if (!flag) {
            return false;
        }
        // 删除当前目录
        if (dirFile.delete()) {
            return true;
        } else {
            return false;
        }
    }

    public static String getFileSuffix(String fileName) {
        return fileName.substring(fileName.lastIndexOf("."));
    }


    public static void writeFile(String filePath, String content, boolean isOverride) throws IOException {
        File file = new File(filePath);
        if (isOverride) {
            file.createNewFile();
        } else {
            if (!file.exists()) {
                file.createNewFile();
            }
        }

        byte[] b = content.getBytes();
        int l = b.length;
        OutputStream os = new FileOutputStream(file);
        os.write(b, 0, l);
        os.close();
    }

    public static void writeFile(String filePath, List list, boolean isOverride) throws IOException {
        File file = new File(filePath);
        if (isOverride) {
            file.createNewFile();
        } else {
            if (!file.exists()) {
                file.createNewFile();
            }
        }

        String content = JSONArray.toJSONString(list);
        byte[] b = content.getBytes();
        int l = b.length;
        OutputStream os = new FileOutputStream(file);
        os.write(b, 0, l);
        os.close();
    }

    public static void fileInputStreamSkip(FileInputStream inputStream, long skip) throws IOException {
        //避免IO错误
        while (skip > 0) {
            long amt = inputStream.skip(skip);
            if (amt == -1) {
                throw new RuntimeException(inputStream + ": unexpected EOF");
            }
            skip -= amt;
        }
    }

    public static void close(RandomAccessFile raf) {
        if (raf != null) {
            try {
                raf.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void close(FileInputStream fis) {
        if (fis != null) {
            try {
                fis.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void close(FileWriter fw) {
        if (fw != null) {
            try {
                fw.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void close(BufferedWriter bw) {
        if (bw != null) {
            try {
                bw.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void close(FileOutputStream fos) {
        if (fos != null) {
            try {
                fos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void close(BufferedOutputStream bos) {
        if (bos != null) {
            try {
                bos.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }


}
