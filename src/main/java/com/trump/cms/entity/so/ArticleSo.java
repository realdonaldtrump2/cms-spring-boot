package com.trump.cms.entity.so;

import java.io.Serializable;

public class ArticleSo implements Serializable {

    private String title;

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
