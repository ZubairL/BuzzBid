package com.BuzzBid.controllers;

import com.BuzzBid.dao.GetMainMenu;
import com.BuzzBid.dao.LoginUser;
import com.BuzzBid.dao.RegisterUser;
import com.BuzzBid.models.client.BidRequest;
import com.BuzzBid.models.client.LoginResponse;
import com.BuzzBid.models.client.MainMenuResponse;
import com.BuzzBid.models.core.User;
import org.hibernate.exception.ConstraintViolationException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private GetMainMenu getMainMenu;

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private RegisterUser addUser;

    @Autowired
    private LoginUser loginUser;

    @GetMapping("/{username}/mainMenu")
    public MainMenuResponse mainMenu(@PathVariable String username) {
        final Optional<MainMenuResponse> mainMenu = getMainMenu.getMainMenu(username);
        return mapper.map(mainMenu, MainMenuResponse.class);
    }

    @GetMapping("/validate/{username}/{password}")
    public ResponseEntity<LoginResponse> login(@PathVariable String username, @PathVariable String password) {
        final Optional<LoginResponse> loginResponse = loginUser.getLoginDetails(username, password);
        if (loginResponse.isPresent()) {
            return new ResponseEntity<>(mapper.map(loginResponse, LoginResponse.class), HttpStatus.OK);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/registration/{username}")
    public ResponseEntity<String> registerUser(@PathVariable String username, @RequestBody User userRegistration) {
        try {
            addUser.registerUser(userRegistration.getUsername(), userRegistration.getPassword(),
                    userRegistration.getFirstName(), userRegistration.getLastName());
        }catch (Exception e){
            if (e.getCause() instanceof ConstraintViolationException) {
            ConstraintViolationException constraintException =
                    (ConstraintViolationException) e.getCause();
            String constraintMsg = constraintException.getMessage();
            String message;
            if(constraintMsg.toUpperCase().contains("PRIMARY"))
                message = "Username already exist. Please try a different username.";
            else if (constraintMsg.toUpperCase().contains("FOREIGN")) {
                message = "Unable to register user";
            }
            else
                message = "Unable to register user";
            return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
        } else {
            return new ResponseEntity<>("Unable to register user.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
        return new ResponseEntity<>("User has been registered successfully.",HttpStatus.OK);

}
}