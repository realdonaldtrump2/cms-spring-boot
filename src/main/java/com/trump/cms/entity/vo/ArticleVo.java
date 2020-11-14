package com.trump.cms.entity.vo;


import java.util.Arrays;
import java.util.Date;
import java.util.List;

public class ArticleVo {

    private Integer id;

    private String title;

    private String describe;

    private Integer userId;

    private Integer articleCategoryId;

    private ArticleCategoryVo articleCategoryVo;

    private Integer[] articleTagId;

    private List<ArticleTagVo> articleTagVoList;

    private String[] imageUrl;

    private String[] fileUrl;

    private String[] videoUrl;

    private Integer clickCount;

    private Integer sort;

    private Integer isRecommend = 0;

    private Integer isShow = 0;

    private Integer isDelete = 0;

    private Date createDatetime;

    private Date updateDatetime;

    @Override
    public String toString() {
        return "ArticleVo{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", describe='" + describe + '\'' +
                ", userId=" + userId +
                ", articleCategoryId=" + articleCategoryId +
                ", articleCategoryVo=" + articleCategoryVo +
                ", articleTagId=" + Arrays.toString(articleTagId) +
                ", articleTagVoList=" + articleTagVoList +
                ", imageUrl=" + Arrays.toString(imageUrl) +
                ", fileUrl=" + Arrays.toString(fileUrl) +
                ", videoUrl=" + Arrays.toString(videoUrl) +
                ", clickCount=" + clickCount +
                ", sort=" + sort +
                ", isRecommend=" + isRecommend +
                ", isShow=" + isShow +
                ", isDelete=" + isDelete +
                ", createDatetime=" + createDatetime +
                ", updateDatetime=" + updateDatetime +
                '}';
    }

    public ArticleVo() {
    }

    public ArticleVo(Integer id, String title, String describe, Integer userId, Integer articleCategoryId, ArticleCategoryVo articleCategoryVo, Integer[] articleTagId, List<ArticleTagVo> articleTagVoList, String[] imageUrl, String[] fileUrl, String[] videoUrl, Integer clickCount, Integer sort, Integer isRecommend, Integer isShow, Integer isDelete, Date createDatetime, Date updateDatetime) {
        this.id = id;
        this.title = title;
        this.describe = describe;
        this.userId = userId;
        this.articleCategoryId = articleCategoryId;
        this.articleCategoryVo = articleCategoryVo;
        this.articleTagId = articleTagId;
        this.articleTagVoList = articleTagVoList;
        this.imageUrl = imageUrl;
        this.fileUrl = fileUrl;
        this.videoUrl = videoUrl;
        this.clickCount = clickCount;
        this.sort = sort;
        this.isRecommend = isRecommend;
        this.isShow = isShow;
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

    public ArticleCategoryVo getArticleCategoryVo() {
        return articleCategoryVo;
    }

    public void setArticleCategoryVo(ArticleCategoryVo articleCategoryVo) {
        this.articleCategoryVo = articleCategoryVo;
    }

    public Integer[] getArticleTagId() {
        return articleTagId;
    }

    public void setArticleTagId(Integer[] articleTagId) {
        this.articleTagId = articleTagId;
    }

    public List<ArticleTagVo> getArticleTagVoList() {
        return articleTagVoList;
    }

    public void setArticleTagVoList(List<ArticleTagVo> articleTagVoList) {
        this.articleTagVoList = articleTagVoList;
    }

    public String[] getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String[] imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String[] getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String[] fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String[] getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String[] videoUrl) {
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
