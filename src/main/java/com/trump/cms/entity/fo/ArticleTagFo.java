package com.trump.cms.entity.fo;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class ArticleTagFo {

    private Integer id;

    @NotNull(message = "文章标签不能为空")
    @NotBlank(message = "文章标签不能为空")
    @Size(min = 3, max = 20, message = "文章标签长度是1-20位")
    private String title;

    public ArticleTagFo() {
    }

    public ArticleTagFo(Integer id, String title) {
        this.id = id;
        this.title = title;
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


    @Override
    public String toString() {
        return "ArticleFo{" +
                "id=" + id +
                ", title='" + title + '\'' +
                '}';
    }

}
