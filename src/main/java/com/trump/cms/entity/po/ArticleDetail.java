package com.trump.cms.entity.po;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.vladmihalcea.hibernate.type.json.JsonStringType;
import org.hibernate.annotations.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Date;


@Entity
@DynamicInsert
@DynamicUpdate
@JsonIgnoreProperties(value = {"hibernateLazyInitializer"})
@EntityListeners(AuditingEntityListener.class)
@Table(name = "article_detail")
@SQLDelete(sql = "update article_detail set is_delete = 1 where id = ?")
@Where(clause = "is_delete = 0")
@TypeDef(name = "json", typeClass = JsonStringType.class)
public class ArticleDetail implements Serializable {

    //这是一个主键 自增主键
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "article_id", columnDefinition = "int(11)")
    private Integer articleId;

    @Column(name = "detail")
    private String detail;

    @Column(name = "detail_phone")
    private String detailPhone;

    @Column(name = "is_delete", columnDefinition = "int(11)")
    private Integer isDelete = 0;

    @CreatedDate
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_datetime", columnDefinition = "datetime default '1970-01-01 00:00:00'")
    private Date createDatetime;

    @CreatedDate
    @LastModifiedDate
    @Temporal(TemporalType.TIMESTAMP)
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "update_datetime", columnDefinition = "datetime default '1970-01-01 00:00:00'")
    private Date updateDatetime;

    public ArticleDetail() {
    }

    public ArticleDetail(Integer articleId, String detail, String detailPhone) {
        this.articleId = articleId;
        this.detail = detail;
        this.detailPhone = detailPhone;
    }

    @Override
    public String toString() {
        return "ArticleDetail{" +
                "id=" + id +
                ", articleId=" + articleId +
                ", detail='" + detail + '\'' +
                ", detailPhone='" + detailPhone + '\'' +
                ", isDelete=" + isDelete +
                ", createDatetime=" + createDatetime +
                ", updateDatetime=" + updateDatetime +
                '}';
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


}
