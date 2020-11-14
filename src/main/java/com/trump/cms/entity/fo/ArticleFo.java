package com.trump.cms.entity.fo;


import javax.validation.constraints.Digits;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class ArticleFo {


    private Integer id;

    @NotNull(message = "文章标题不能为空")
    @NotBlank(message = "文章标题不能为空")
    @Size(min = 1, max = 50, message = "文章标题长度是1-50位")
    private String title;

    @NotNull(message = "文章描述不能为空")
    @NotBlank(message = "文章描述不能为空")
    @Size(min = 1, max = 255, message = "文章描述长度是1-255位")
    private String describe;

    private Integer userId;

    @NotNull(message = "文章分类不能为空")
    @NotBlank(message = "文章分类不能为空")
    @Digits(integer = 11, fraction = 0, message = "文章分类参数错误")
    private Integer articleCategoryId;

    @NotNull(message = "文章标签不能为空")
    @NotBlank(message = "文章标签不能为空")
    private Integer[] articleTagId;

    private String[] imageUrl;

    private String[] fileUrl;

    private String[] videoUrl;

    private Integer sort;

    private Integer isRecommend;

    private Integer isShow;

    public ArticleFo() {
    }

    public ArticleFo(Integer id, String title, String describe, Integer userId, Integer articleCategoryId, Integer[] articleTagId, String[] imageUrl, String[] fileUrl, String[] videoUrl, Integer sort, Integer isRecommend, Integer isShow) {
        this.id = id;
        this.title = title;
        this.describe = describe;
        this.userId = userId;
        this.articleCategoryId = articleCategoryId;
        this.articleTagId = articleTagId;
        this.imageUrl = imageUrl;
        this.fileUrl = fileUrl;
        this.videoUrl = videoUrl;
        this.sort = sort;
        this.isRecommend = isRecommend;
        this.isShow = isShow;
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

    public Integer[] getArticleTagId() {
        return articleTagId;
    }

    public void setArticleTagId(Integer[] articleTagId) {
        this.articleTagId = articleTagId;
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


}
