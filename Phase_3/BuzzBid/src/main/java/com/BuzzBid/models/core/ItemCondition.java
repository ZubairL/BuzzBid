package com.BuzzBid.models.core;

import lombok.Getter;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Getter
public enum ItemCondition {
    NEW("New"),
    VERY_GOOD("Very Good"),
    GOOD("Good"),
    FAIR("Fair"),
    POOR("Poor");

    private static final Map<String, ItemCondition> LOOKUP = Arrays.stream(values())
            .collect(Collectors.toMap(ItemCondition::getItemCondition, Function.identity()));

    private final String itemCondition;

    ItemCondition(final String itemCondition) {
        this.itemCondition = itemCondition;
    }

    public static ItemCondition fromString(final String itemCondition) {
        return LOOKUP.get(itemCondition);
    }
}
