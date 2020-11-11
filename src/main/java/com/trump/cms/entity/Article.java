package com.trump.cms.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;
import java.util.List;


@Entity
@DynamicInsert
@DynamicUpdate
@JsonIgnoreProperties(value = {"hibernateLazyInitializer"})
@EntityListeners(AuditingEntityListener.class)
@Table(name = "article")
@SQLDelete(sql = "update article set is_delete = 1 where id = ?")
@Where(clause = "is_delete = 0")
public class Article implements Serializable {

    //这是一个主键 自增主键
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull(message = "文章标题不能为空")
    @Size(min = 1, max = 20, message = "文章标题长度是1-20位")
    @Column(name = "title", length = 20, columnDefinition = "varchar(255)")
    private String title;

    @NotNull(message = "文章简介不能为空")
    @Size(min = 1, max = 255, message = "文章简介长度是1-255位")
    @Column(name = "describe", length = 255, columnDefinition = "varchar(255)")
    private String describe;

    @Column(name = "user_id", columnDefinition = "int(11)")
    private Integer userId;

    @Column(name = "article_category_id", columnDefinition = "int(11)")
    private Integer articleCategoryId;

    @Column(name = "article_tag_id", columnDefinition = "json")
    private List<Integer> articleTagId;

    @Column(name = "image_url", columnDefinition = "json")
    private List<String> imageUrl;

    @Column(name = "file_url", columnDefinition = "json")
    private List<String> fileUrl;

    @Column(name = "video_url", columnDefinition = "json")
    private List<String> videoUrl;

    @Column(name = "click_count", columnDefinition = "int(11)")
    private Integer clickCount;

    @Column(name = "sort", columnDefinition = "int(11)")
    private Integer sort;

    @Column(name = "is_recommend", columnDefinition = "int(11)")
    private Integer isRecommend = 0;

    @Column(name = "is_show", columnDefinition = "int(11)")
    private Integer isShow = 0;

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

    @Override
    public String toString() {
        return "Article{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", describe='" + describe + '\'' +
                ", userId=" + userId +
                ", articleCategoryId=" + articleCategoryId +
                ", articleTagId=" + articleTagId +
                ", imageUrl=" + imageUrl +
                ", fileUrl=" + fileUrl +
                ", videoUrl=" + videoUrl +
                ", clickCount=" + clickCount +
                ", sort=" + sort +
                ", isRecommend=" + isRecommend +
                ", isShow=" + isShow +
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescribe() {
        return describe;
    }

    public void setDescribe(String describe) {
        this.describe = describe;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getArticleCategoryId() {
        return articleCategoryId;
    }

    public void setArticleCategoryId(Integer articleCategoryId) {
        this.articleCategoryId = articleCategoryId;
    }

    public List<Integer> getArticleTagId() {
        return articleTagId;
    }

    public void setArticleTagId(List<Integer> articleTagId) {
        this.articleTagId = articleTagId;
    }

    public List<String> getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(List<String> imageUrl) {
        this.imageUrl = imageUrl;
    }

    public List<String> getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(List<String> fileUrl) {
        this.fileUrl = fileUrl;
    }

    public List<String> getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(List<String> videoUrl) {
        this.videoUrl = videoUrl;
    }

    public Integer getClickCount() {
        return clickCount;
    }

    public void setClickCount(Integer clickCount) {
        this.clickCount = clickCount;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Integer getIsRecommend() {
        return isRecommend;
    }

    public void setIsRecommend(Integer isRecommend) {
        this.isRecommend = isRecommend;
    }

    public Integer getIsShow() {
        return isShow;
    }

    public void setIsShow(Integer isShow) {
        this.isShow = isShow;
    }

    public Integer getIsDelete() {
        return isDelete;
    }

    public void setIsDelete(Integer isDelete) {
        this.isDelete = isDelete;
    }

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date getCreateDatetime() {
        return createDatetime;
    }

    public void setCreateDatetime(Date createDatetime) {
        this.createDatetime = createDatetime;
    }

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date getUpdateDatetime() {
        return updateDatetime;
    }

    public void setUpdateDatetime(Date updateDatetime) {
        this.updateDatetime = updateDatetime;
    }

}
