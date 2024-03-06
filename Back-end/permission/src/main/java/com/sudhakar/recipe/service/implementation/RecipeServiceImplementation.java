package com.sudhakar.recipe.service.implementation;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.apache.commons.io.FilenameUtils;
import org.springframework.util.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sudhakar.recipe.dto.RecipeDto;
import com.sudhakar.recipe.dto.RecipeIdDTO;
import com.sudhakar.recipe.dto.RecipeRequestDto;
import com.sudhakar.recipe.entity.Category;
import com.sudhakar.recipe.entity.Comment;
import com.sudhakar.recipe.entity.Cuisine;
import com.sudhakar.recipe.entity.Ingredient;
import com.sudhakar.recipe.entity.Recipe;
import com.sudhakar.recipe.entity.User;
import com.sudhakar.recipe.repository.CategoryRepository;
import com.sudhakar.recipe.repository.CuisineRepository;
import com.sudhakar.recipe.repository.RecipeRepository;
import com.sudhakar.recipe.repository.UserRepository;
import com.sudhakar.recipe.service.CommentService;
import com.sudhakar.recipe.service.IngredientService;
import com.sudhakar.recipe.service.RecipeService;

@Service
public class RecipeServiceImplementation implements RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CuisineRepository cuisineRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private IngredientService ingredientService;

    @Autowired
    private CommentService commentService;

    @Value("${file.upload-dir-recipe-images}")
    private String uploadDir;

    @Value("${file.upload-dir}")
    private String uploadPath;

    @Override
    public ResponseEntity<RecipeIdDTO> createRecipe(String id, RecipeRequestDto recipe) {
        try {
            Optional<User> existingUser = userRepository.findById(id);
            if (existingUser.isPresent()) {
                Recipe createRecipe = new Recipe();
                createRecipe.setUser(existingUser.get());
                createRecipe.setCategory(category(recipe.getCategory()));
                createRecipe.setCuisine(cuisine(recipe.getCuisine()));
                createRecipe.setDateCreated(new Date());
                createRecipe.setIngredients(ingredientService.createIngredients(recipe.getIngredients()));
                createRecipe.setDescription(recipe.getDescription());
                createRecipe.setInstructions(recipe.getInstructions());
                createRecipe.setTitle(recipe.getTitle());
                createRecipe.setServings(recipe.getServings());
                createRecipe.setVideo(recipe.getVideo());
                Recipe savedRecipe = recipeRepository.save(createRecipe);
                RecipeIdDTO newResponse = new RecipeIdDTO();
                newResponse.setId(savedRecipe.getId());
                return new ResponseEntity<>(newResponse, HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Void> updateRecipeImage(String id, MultipartFile imageFile) {
        try {
            validateImageFile(imageFile);
            Optional<Recipe> recipeOptional = recipeRepository.findById(id);
            if (recipeOptional.isPresent()) {
                Recipe recipe = recipeOptional.get();
                recipe.setPhoto(generateImageUrl(recipe.getId(), imageFile));
                recipeRepository.save(recipe);
                return new ResponseEntity<>( HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>( HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private Category category(String category) {
        Optional<Category> existingCategory = categoryRepository.findByName(category);
        if (existingCategory.isPresent()) {
            return existingCategory.get();
        }
        return categoryRepository.save(new Category(category));
    }

    private Cuisine cuisine(String cuisine) {
        Optional<Cuisine> existingCuisine = cuisineRepository.findByName(cuisine);
        if (existingCuisine.isPresent()) {
            return existingCuisine.get();
        }
        return cuisineRepository.save(new Cuisine(cuisine));
    }

    private void validateImageFile(MultipartFile imageFile) {
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileExtension = FilenameUtils.getExtension(imageFile.getOriginalFilename());
            if (!Arrays.asList("jpg", "jpeg", "png").contains(fileExtension.toLowerCase())) {
                throw new IllegalArgumentException("Invalid image file type");
            }
        }
    }

    private String generateImageUrl(String recipeId, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = StringUtils.cleanPath(imageFile.getOriginalFilename());
            String fileExtension = FilenameUtils.getExtension(fileName);
            String newFileName = recipeId + "." + fileExtension;

            String filePath = uploadDir + "/" + newFileName;

            String fileStorePath = uploadPath + "/recipeImage" + "/" + newFileName;

            try (InputStream inputStream = imageFile.getInputStream()) {
                Files.copy(inputStream, Paths.get(fileStorePath), StandardCopyOption.REPLACE_EXISTING);
            }
            return filePath;
        }
        return null;
    }

    @Override
    public ResponseEntity<Page<RecipeDto>> getAllRecipesOrderByCreationDate(Pageable pageable) {
        try {
            Page<Recipe> recipes = recipeRepository
                    .findByOrderByDateCreatedDesc(PageRequest.of(pageable.getPageNumber(), pageable.getPageSize()));

            return new ResponseEntity<>(recipes.map(this::convertDto), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> updateRecipe(String id, String recipeId, RecipeRequestDto updateRecipe) {
        try {
            Optional<Recipe> existingRecipeOptional = recipeRepository.findById(recipeId);
            Optional<User> userOptional = userRepository.findById(id);
            System.out.println(userOptional);
            if (existingRecipeOptional.isPresent() && userOptional.isPresent()) {
                Recipe existingRecipe = existingRecipeOptional.get();

                existingRecipe.setTitle(
                        updateRecipe.getTitle() != null ? updateRecipe.getTitle() : existingRecipe.getTitle());
                existingRecipe.setCategory(
                        updateRecipe.getCategory() != null ? category(updateRecipe.getCategory())
                                : existingRecipe.getCategory());
                existingRecipe.setCuisine(
                        updateRecipe.getCuisine() != null ? cuisine(updateRecipe.getCuisine())
                                : existingRecipe.getCuisine());
                existingRecipe.setCookingTime(updateRecipe.getCookingTime() != 0 ? updateRecipe.getCookingTime()
                        : existingRecipe.getCookingTime());
                existingRecipe.setPreparationTime(
                        updateRecipe.getPreparationTime() != 0 ? updateRecipe.getPreparationTime()
                                : existingRecipe.getPreparationTime());
                existingRecipe.setDescription(updateRecipe.getDescription() != null ? updateRecipe.getDescription()
                        : existingRecipe.getDescription());
                existingRecipe.setInstructions(updateRecipe.getInstructions() != null ? updateRecipe.getInstructions()
                        : existingRecipe.getInstructions());

                ingredientService.deleteIngredients(existingRecipe.getIngredients());
                Set<Ingredient> updatedIngredients = ingredientService.createIngredients(updateRecipe.getIngredients());
                existingRecipe.setIngredients(updatedIngredients);

                recipeRepository.save(existingRecipe);

                return new ResponseEntity<>("Recipe updated successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Recipe does not exist", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> deleteRecipe(String recipeId) {
        try {
            Optional<Recipe> optionalRecipe = recipeRepository.findById(recipeId);
            if (optionalRecipe.isPresent()) {
                optionalRecipe.get().setDeletedAt(new Date());
                recipeRepository.save(optionalRecipe.get());
                return new ResponseEntity<>("Recipe deleted successfully", HttpStatus.OK);
            }
            return new ResponseEntity<>("Recipe does not exists", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Problem in deleting the recipe", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<Page<RecipeDto>> getAllRecipeByUserId(String userId, Pageable pageable) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);

            if (userOptional.isPresent()) {
                User user = userOptional.get();

                Page<Recipe> recipesPage = recipeRepository.findByUserOrderByDateCreated(user, pageable);

                return new ResponseEntity<>(recipesPage.map(this::convertDto), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> commentRecipe(String recipeId, String userId, Comment comment) {
        try {
            if (recipeId == null || userId == null || comment == null) {
                return new ResponseEntity<>("Invalid input parameters", HttpStatus.BAD_REQUEST);
            }

            Optional<Recipe> recipeOptional = recipeRepository.findById(recipeId);

            if (recipeOptional.isPresent()) {
                Recipe recipe = recipeOptional.get();

                Optional<User> userOptional = userRepository.findById(userId);

                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    List<String> comments = recipe.getComments();
                    if (recipe.getComments() == null) {
                        comments = new LinkedList<>();
                    }
                    Comment savedComment = commentService.createComment(comment, user, recipe.getId());
                    comments.add(savedComment.getId());
                    recipe.setComments(comments);
                    recipeRepository.save(recipe);

                    return new ResponseEntity<>("Comment added successfully", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
                }
            } else {
                return new ResponseEntity<>("Recipe not found", HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error commenting on the recipe", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> saveRecipeForUser(String userId, String recipeId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            Optional<Recipe> recipeOptional = recipeRepository.findById(recipeId);

            if (userOptional.isPresent() && recipeOptional.isPresent()) {
                User user = userOptional.get();
                Recipe recipe = recipeOptional.get();

                if (user.getSavedRecipes() == null) {
                    user.setSavedRecipes(new HashSet<>());
                }

                if (!user.getSavedRecipes().contains(recipe.getId())) {
                    user.getSavedRecipes().add(recipe.getId());
                    userRepository.save(user);
                    return new ResponseEntity<>("Recipe saved for user successfully", HttpStatus.OK);
                } else {
                    return new ResponseEntity<>("Recipe is already saved for the user", HttpStatus.BAD_REQUEST);
                }
            } else {
                return new ResponseEntity<>("User or Recipe not found", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Problem in saving the recipe for the user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> updateRecipeLike(String recipeId, String userId, boolean like) {
        try {
            Optional<Recipe> optionalRecipe = recipeRepository.findById(recipeId);
            Optional<User> optionalUser = userRepository.findById(userId);
            if (optionalRecipe.isPresent() && optionalUser.isPresent()) {
                Recipe recipe = optionalRecipe.get();
                User user = optionalUser.get();

                Set<String> likes = recipe.getLikes();
                if (likes == null) {
                    likes = new HashSet<>();
                }

                if (like) {
                    likes.add(user.getId());
                    recipe.setLikes(likes);
                    recipeRepository.save(recipe);
                } else {
                    likes.remove(user.getId());
                    recipe.setLikes(likes);
                    recipeRepository.save(recipe);
                }
                return new ResponseEntity<>("Like updated successfully", HttpStatus.OK);
            }
            return new ResponseEntity<>("User or Recipe not found", HttpStatus.BAD_REQUEST);
        } catch (

        Exception e) {
            return new ResponseEntity<>("Problem in updating recipe like", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<List<Recipe>> getAllRecipeByTitle(String title, Pageable pageable) {
        try {
            Page<Recipe> recipes;

            if (title == null || title.trim().isEmpty()) {
                recipes = recipeRepository.findByOrderByDateCreatedDesc(pageable);
            } else {
                recipes = recipeRepository.findByTitleContainingIgnoreCaseOrderByDateCreatedDesc(title, pageable);
            }

            List<Recipe> recipeList = recipes.getContent();

            if (!recipeList.isEmpty()) {
                return new ResponseEntity<>(recipeList, HttpStatus.OK);
            }

            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private RecipeDto convertDto(Recipe recipe) {
        RecipeDto recipeDto = new RecipeDto();
        recipeDto.setRecipeId(recipe.getId());
        recipeDto.setTitle(recipe.getTitle());
        recipeDto.setDateCreated(recipe.getDateCreated());
        recipeDto.setDeletedAt(recipe.getDeletedAt());
        recipeDto.setCategory(recipe.getCategory().getName());
        recipeDto.setCuisine(recipe.getCuisine().getName());
        recipeDto.setUserId(recipe.getUser().getId());
        recipeDto.setUsername(recipe.getUser().getUsernameValue());
        recipeDto.setProfileImageUrl(recipe.getUser().getProfileImageUrl());
        recipeDto.setDescription(recipe.getDescription());
        recipeDto.setRecipeImageUrl(recipe.getPhoto());
        recipeDto.setVideo(recipe.getVideo());

        return recipeDto;
    }

    @Override
    public ResponseEntity<Recipe> getRecipeById(String id) {
        try {
            Optional<Recipe> recipeOptional = recipeRepository.findById(id);
            if (recipeOptional.isPresent()) {
                return new ResponseEntity<>(recipeOptional.get(), HttpStatus.OK);
            }
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
