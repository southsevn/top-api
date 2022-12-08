import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { UserEmail } from "../decorators/userEmail.decorator";
import { PRODUCT_NOT_FOUND } from "../product/product.constants";
import { CreateReviewDto } from "./dto/create-review.dto";
import { REVIEW_NOT_FOUND } from "./review.constants";
import { ReviewService } from "./review.service";

@Controller("review")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UsePipes(new ValidationPipe())
  @HttpCode(201)
  @Post("create")
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    const deletedDoc = await this.reviewService.delete(id);

    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("byProduct/:productId")
  async getByProduct(
    @Param("productId") productId: string,
    @UserEmail() email: string,
  ) {
    return this.reviewService.findByProductId(productId);
  }

  @Delete("byProduct/:id")
  async deleteByProductId(@Param("id") productId: string) {
    const deletedDoc = await this.reviewService.deleteByProductId(productId);

    if (!deletedDoc) {
      throw new HttpException(PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
