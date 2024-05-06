package com.BuzzBid.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@Service
public class UserReportService {
    @Autowired
    private JdbcTemplate userReport;


    @GetMapping("/userReport")
    public List<Map<String, Object>> generateReport() {
        String sql = "WITH Listed_temp(Username,Listed) AS (SELECT ListedByUser,Count(ItemID) FROM Item Group BY ListedByUser), " +
                "Sold_temp(Username,Sold) AS (SELECT ListedByUser,Count(ItemID)FROM Item I " +
                "WHERE I.CancelledDate IS NULL AND I.ItemID IN " +
                "(SELECT B.ItemID FROM Bid B WHERE B.BidAmount =(SELECT Max(Bid.BidAmount) FROM Bid INNER JOIN Item ON " +
                "Item.ItemID=Bid.ItemID " +
                "WHERE Item.AuctionEndTime<utc_timestamp() AND Bid.ItemID=B.ItemID AND " +
                "Item.MinimumSalePrice<=Bid.BidAmount " +
                "Group BY Bid.ItemID)) " +
                "GROUP BY I.ListedByUser), " +
                "Won_temp(Username,Won) AS (SELECT B.Username,COUNT(B.ItemID) FROM Bid B WHERE B.BidAmount =(SELECT Max(Bid.BidAmount) FROM Bid INNER JOIN Item ON " +
                "Item.ItemID=Bid.ItemID " +
                "WHERE Item.AuctionEndTime<utc_timestamp() AND Bid.ItemID=B.ItemID AND Item.CancelledDate IS NULL AND Bid.BidAmount>=Item.MinimumSalePrice " +
                "Group BY Bid.ItemID) GROUP BY B.Username), " +
                "Won_Items(Username,ItemID) AS (SELECT B.Username,B.ItemID FROM Bid B WHERE B.BidAmount =(SELECT Max(Bid.BidAmount) FROM Bid INNER JOIN Item ON " +
                "Bid.ItemID=Item.ItemID " +
                "WHERE Item.AuctionEndTime<utc_timestamp() AND Bid.ItemID=B.ItemID AND Item.CancelledDate IS NULL AND Bid.BidAmount>=Item.MinimumSalePrice " +
                "Group BY Bid.ItemID)), " +
                "Rated_temp(Username,Rated) AS (SELECT W.Username,Count(W.ItemID) FROM Won_Items W INNER JOIN Rating R ON R.ItemID=W.ItemID GROUP BY W.Username), " +
                "Category_User_Count(ListedByUser,ItemCondition,Total_Count) AS (SELECT ListedByUser,ItemCondition, Count(*) AS 'Total_Count' " +
                "FROM Item " +
                "GROUP BY " +
                "ListedByUser,ItemCondition), " +
                "Category_max(ListedByUser,ItemCondition) AS (SELECT C.ListedByUser, C.ItemCondition FROM " +
                "Category_User_Count C where Total_Count=(SELECT Max(Total_Count) FROM Category_User_Count L " +
                "Where C.ListedByUser=L.ListedByUser Group BY ListedByUser)), "+
                "Condition_temp(Username,Numbers,ItemCondition) AS (SELECT ListedByUser,Max(ItemCondition+0) AS 'Numbers', " +
                "CASE WHEN Max(ItemCondition+0)=1 THEN 'New' " +
                "WHEN Max(ItemCondition+0)=2 THEN 'Very Good' " +
                "WHEN Max(ItemCondition+0)=3 THEN 'Good' " +
                "WHEN Max(ItemCondition+0)=4 THEN 'Fair' " +
                "WHEN Max(ItemCondition+0)=5 THEN 'Poor' " +
                "END AS 'ItemCondition' " +
                "FROM Category_max " +
                "GROUP BY " +
                "ListedByUser) "+
                "SELECT U.Username AS Username, coalesce(L.Listed,0) AS 'Listed', " +
                "coalesce(S.Sold,0) AS 'Sold', coalesce(W.Won,0) AS 'Won', coalesce(R.Rated,0) AS 'Rated', coalesce(C.ItemCondition,'N/A') AS 'Most Frequent Condition' " +
                "FROM User U LEFT JOIN Listed_temp L ON U.Username=L.Username " +
                "LEFT JOIN Sold_temp S ON U.Username=S.Username " +
                "LEFT JOIN Won_temp W ON U.Username=W.Username " +
                "LEFT JOIN Rated_temp R ON U.Username=R.Username " +
                "LEFT JOIN Condition_temp C ON U.Username=C.Username " +
                "ORDER BY L.Listed DESC";
        return userReport.queryForList(sql);

       /* List<Object[]> results = userReport.query(sql,new ResultSetExtractor<List<Object[]>>() {
            @Override
            public List<Object[]> extractData(ResultSet rs) throws SQLException {
                List<Object[]> resultList = new ArrayList();
                while (rs.next()) {
                    Object row = new Object[]{
                            rs.getObject("Username"),
                            rs.getObject("Listed"),
                            rs.getObject("Sold"),
                            rs.getObject("Won"),
                            rs.getObject("Rated"),
                            rs.getObject("Most Frequent Condition")
                    };
                    resultList.add(row);
                }
                return resultList;
            }
        });
        return results;
        */

    }
}

