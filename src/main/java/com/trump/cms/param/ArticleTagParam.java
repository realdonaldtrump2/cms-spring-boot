package com.trump.cms.param;


public class ArticleTagParam {

    private String title;

    public ArticleTagParam() {
    }

    public ArticleTagParam(String title) {
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
        return "ArticleTagParam{" +
                "title='" + title + '\'' +
                '}';
    }

}
