package com.trump.cms.controller;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.lang.Dict;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.qiniu.http.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;


@Controller
public class DemoController {

    private String fileTempPath = System.getProperty("user.dir") + "/src/main/resources/static/upload";

    @RequestMapping({"/demo/upload"})
    public String upload() {

        System.out.println(fileTempPath);
        return "demo/upload";

    }

    @ResponseBody
    @RequestMapping(value = "/demo/upload/local", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Dict local(@RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return Dict.create().set("code", 400).set("message", "文件内容为空");
        }
        String fileName = file.getOriginalFilename();
        String rawFileName = StrUtil.subBefore(fileName, ".", true);
        String fileType = StrUtil.subAfter(fileName, ".", true);
        String localFilePath = StrUtil.appendIfMissing(fileTempPath, "/") + rawFileName + "-" + DateUtil.current(false) + "." + fileType;
        try {
            file.transferTo(new File(localFilePath));
        } catch (IOException e) {
            System.out.println(e.getMessage());
            return Dict.create().set("code", 500).set("message", "文件上传失败");
        }

        return Dict.create().set("code", 200).set("message", "上传成功").set("data", Dict.create().set("fileName", fileName).set("filePath", localFilePath));

    }


}
