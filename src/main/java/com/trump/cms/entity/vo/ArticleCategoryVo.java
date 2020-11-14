package com.trump.cms.entity.vo;

import java.util.Date;

public class ArticleCategoryVo {

    private Integer id;

    private String name;

    private Integer isDelete = 0;

    private Date createDatetime;

    private Date updateDatetime;

    public ArticleCategoryVo() {
    }

    public ArticleCategoryVo(Integer id, String name, Integer isDelete, Date createDatetime, Date updateDatetime) {
        this.id = id;
        this.name = name;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
        return "ArticleCategoryVo{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", isDelete=" + isDelete +
                ", createDatetime=" + createDatetime +
                ", updateDatetime=" + updateDatetime +
                '}';
    }

}
