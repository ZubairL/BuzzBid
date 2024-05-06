package com.BuzzBid.util;

import com.BuzzBid.models.core.ItemCondition;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class ItemConditionConverter implements AttributeConverter<ItemCondition, String> {
    @Override
    public String convertToDatabaseColumn(ItemCondition value){
        return value.getItemCondition();
    }

    @Override
    public ItemCondition convertToEntityAttribute(String value) {
        return ItemCondition.fromString(value);
    }
}