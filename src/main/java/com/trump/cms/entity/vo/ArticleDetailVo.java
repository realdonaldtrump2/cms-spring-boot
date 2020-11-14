package com.trump.cms.entity.vo;


import java.util.Date;


public class ArticleDetailVo {

    private Integer id;

    private Integer articleId;

    private String detail;

    private String detailPhone;

    private Integer isDelete = 0;

    private Date createDatetime;

    private Date updateDatetime;

    public ArticleDetailVo() {
    }

    public ArticleDetailVo(Integer id, Integer articleId, String detail, String detailPhone, Integer isDelete, Date createDatetime, Date updateDatetime) {
        this.id = id;
        this.articleId = articleId;
        this.detail = detail;
        this.detailPhone = detailPhone;
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

    public Integer getArticleId() {
        return articleId;
    }

    public void setArticleId(Integer articleId) {
        this.articleId = articleId;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public String getDetailPhone() {
        return detailPhone;
    }

    public void setDetailPhone(String detailPhone) {
        this.detailPhone = detailPhone;
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
        return "ArticleDetailVo{" +
                "id=" + id +
                ", articleId=" + articleId +
                ", detail='" + detail + '\'' +
                ", detailPhone='" + detailPhone + '\'' +
                ", isDelete=" + isDelete +
                ", createDatetime=" + createDatetime +
                ", updateDatetime=" + updateDatetime +
                '}';
    }

}
