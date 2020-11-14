package com.trump.cms.entity.vo;


import java.util.Date;

public class ArticleTagVo {

    private Integer id;

    private String title;

    private Integer isDelete = 0;

    private Date createDatetime;

    private Date updateDatetime;

    public ArticleTagVo() {
    }

    public ArticleTagVo(Integer id, String title, Integer isDelete, Date createDatetime, Date updateDatetime) {
        this.id = id;
        this.title = title;
        this.isDelete = isDelete;
        this.createDatetime = createDatetime;
        this.updateDatetime = updateDatetime;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getIsDelete() {
        return isDelete;
    }

    public void setIsDelete(Integer isDelete) {
        this.isDelete = isDelete;
    }

    public Date getCreateDatetime() {
        return createDatetime;
    }

    public void setCreateDatetime(Date createDatetime) {
        this.createDatetime = createDatetime;
    }

    public Date getUpdateDatetime() {
        return updateDatetime;
    }

    public void setUpdateDatetime(Date updateDatetime) {
        this.updateDatetime = updateDatetime;
    }

    @Override
    public String toString() {
        return "ArticleTagVo{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", isDelete=" + isDelete +
                ", createDatetime=" + createDatetime +
                ", updateDatetime=" + updateDatetime +
                '}';
    }

}
