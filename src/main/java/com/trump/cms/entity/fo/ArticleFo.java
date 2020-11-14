package com.trump.cms.entity.fo;

public class ArticleFo {

    private Integer id;

    private String title;

    public ArticleFo() {
    }

    public ArticleFo(Integer id, String title) {
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
