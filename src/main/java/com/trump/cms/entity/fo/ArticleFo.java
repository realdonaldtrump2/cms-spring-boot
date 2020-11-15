package com.trump.cms.entity.fo;


import javax.validation.constraints.Digits;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Arrays;


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
    private Integer articleCategoryId;

    @NotNull(message = "文章标签不能为空")
    private Integer[] articleTagId;

    @NotNull(message = "文章排序不能为空")
    private Integer sort;

    @NotNull(message = "文章是否推荐不能为空")
    private Integer isRecommend;

    @NotNull(message = "文章是否展示不能为空")
    private Integer isShow;

    @NotNull(message = "文章内容不能为空")
    @NotBlank(message = "文章内容不能为空")
    @Size(min = 1, message = "文章手机内容不能为空")
    private String detail;

    @NotNull(message = "文章手机内容不能为空")
    @NotBlank(message = "文章手机内容不能为空")
    @Size(min = 1, message = "文章手机内容不能为空")
    private String detailPhone;

    public ArticleFo() {
    }

    public ArticleFo(Integer id, @NotNull(message = "文章标题不能为空") @NotBlank(message = "文章标题不能为空") @Size(min = 1, max = 50, message = "文章标题长度是1-50位") String title, @NotNull(message = "文章描述不能为空") @NotBlank(message = "文章描述不能为空") @Size(min = 1, max = 255, message = "文章描述长度是1-255位") String describe, Integer userId, @NotNull(message = "文章分类不能为空") Integer articleCategoryId, @NotNull(message = "文章标签不能为空") Integer[] articleTagId, @NotNull(message = "文章排序不能为空") Integer sort, @NotNull(message = "文章是否推荐不能为空") Integer isRecommend, @NotNull(message = "文章是否展示不能为空") Integer isShow, @NotNull(message = "文章内容不能为空") @NotBlank(message = "文章内容不能为空") @Size(min = 1, message = "文章手机内容不能为空") String detail, @NotNull(message = "文章手机内容不能为空") @NotBlank(message = "文章手机内容不能为空") @Size(min = 1, message = "文章手机内容不能为空") String detailPhone) {
        this.id = id;
        this.title = title;
        this.describe = describe;
        this.userId = userId;
        this.articleCategoryId = articleCategoryId;
        this.articleTagId = articleTagId;
        this.sort = sort;
        this.isRecommend = isRecommend;
        this.isShow = isShow;
        this.detail = detail;
        this.detailPhone = detailPhone;
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

    @Override
    public String toString() {
        return "ArticleFo{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", describe='" + describe + '\'' +
                ", userId=" + userId +
                ", articleCategoryId=" + articleCategoryId +
                ", articleTagId=" + Arrays.toString(articleTagId) +
                ", sort=" + sort +
                ", isRecommend=" + isRecommend +
                ", isShow=" + isShow +
                ", detail='" + detail + '\'' +
                ", detailPhone='" + detailPhone + '\'' +
                '}';
    }

}
