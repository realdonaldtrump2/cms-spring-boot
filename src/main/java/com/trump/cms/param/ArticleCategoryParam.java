package com.trump.cms.param;



public class ArticleCategoryParam {

    private String name;

    public ArticleCategoryParam() {
    }

    public ArticleCategoryParam(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "ArticleCategoryParam{" +
                "name='" + name + '\'' +
                '}';
    }


}
