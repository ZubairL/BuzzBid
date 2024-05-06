package com.BuzzBid.controllers;

import com.BuzzBid.dao.GetCategories;
import com.BuzzBid.models.core.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Service
public class CategoryController {

    @Autowired
    private GetCategories getCategories;

    @GetMapping("/categories")
    public List<Category> getAllCategories() {
        return getCategories.getCategories();
    }
}
