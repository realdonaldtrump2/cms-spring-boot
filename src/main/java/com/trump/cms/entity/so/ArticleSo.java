package com.trump.cms.entity.so;

import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

public class ArticleSo implements Serializable {

    private String title;

    private Integer pageSize;

    private Integer pageNum;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createDatetimeStart;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createDatetimeEnd;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateDatetimeStart;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME, pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateDatetimeEnd;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getPageNum() {
        return pageNum;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }

    public Date getCreateDatetimeStart() {
        return createDatetimeStart;
    }

    public void setCreateDatetimeStart(Date createDatetimeStart) {
        this.createDatetimeStart = createDatetimeStart;
    }

    public Date getCreateDatetimeEnd() {
        return createDatetimeEnd;
    }

    public void setCreateDatetimeEnd(Date createDatetimeEnd) {
        this.createDatetimeEnd = createDatetimeEnd;
    }

    public Date getUpdateDatetimeStart() {
        return updateDatetimeStart;
    }

    public void setUpdateDatetimeStart(Date updateDatetimeStart) {
        this.updateDatetimeStart = updateDatetimeStart;
    }

    public Date getUpdateDatetimeEnd() {
        return updateDatetimeEnd;
    }

    public void setUpdateDatetimeEnd(Date updateDatetimeEnd) {
        this.updateDatetimeEnd = updateDatetimeEnd;
    }

    public ArticleSo() {
    }

    public ArticleSo(String title, Integer pageSize, Integer pageNum, Date createDatetimeStart, Date createDatetimeEnd, Date updateDatetimeStart, Date updateDatetimeEnd) {
        this.title = title;
        this.pageSize = pageSize;
        this.pageNum = pageNum;
        this.createDatetimeStart = createDatetimeStart;
        this.createDatetimeEnd = createDatetimeEnd;
        this.updateDatetimeStart = updateDatetimeStart;
        this.updateDatetimeEnd = updateDatetimeEnd;
    }

    @Override
    public String toString() {
        return "ArticleSo{" +
                "title='" + title + '\'' +
                ", pageSize=" + pageSize +
                ", pageNum=" + pageNum +
                ", createDatetimeStart=" + createDatetimeStart +
                ", createDatetimeEnd=" + createDatetimeEnd +
                ", updateDatetimeStart=" + updateDatetimeStart +
                ", updateDatetimeEnd=" + updateDatetimeEnd +
                '}';
    }

}
