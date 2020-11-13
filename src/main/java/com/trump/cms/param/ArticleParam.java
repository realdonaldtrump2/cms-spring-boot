package com.trump.cms.param;


public class ArticleParam {

    private String title;

    public ArticleParam() {
    }

    public ArticleParam(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String toString() {
        return "ArticleParam{" +
                "title='" + title + '\'' +
                '}';
    }

}
