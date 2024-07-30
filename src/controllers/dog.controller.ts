import { IDogController } from "@/controllers/interfaces/i.dog.controller";
import { CreateNewDogRequestDto } from "@/dto/dog/CreateNewDogRequestDto";
import { CreateNewDogResponseDto } from "@/dto/dog/CreateNewDogResponseDto";
import { BaseResponse } from "@/dto/response/BaseResponse.dto";
import { IDogService } from "@/services/interfaces/i.dog.service";
import { DiTypes } from "@/types/di/DiTypes";
import { convertToDto } from "@/utils/dto-convert/convert-to-dto";
import ResponseGenerator from "@/utils/response/ResponseGenerator";
import { createNewDogValidateSchema } from "@/validation/dog.validation";
import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";

@injectable()
export class DogController implements IDogController {
    protected dogService: IDogService;

    constructor(
        @inject(DiTypes.DOG_SERVICE) dogService: IDogService,
    ){
        this.dogService = dogService
    }

    /**
     ** POST /dog/create
     * @param req
     * @param res
     * @param next
     */
    async createNewDog
    (
        req: Request, 
        res: Response<BaseResponse<CreateNewDogResponseDto>>, 
        next: NextFunction) 
    : Promise<void>
    {
        try {
            const data = req.body;

            //Validate request body
            await createNewDogValidateSchema.validateAsync(data);
    
            // Convert request to DTO
            const requestDtoConverted = convertToDto(CreateNewDogRequestDto, data);
    
            const result = await this.dogService.create(requestDtoConverted);
    
            // Convert result to DTO
            const responseDtoConverted = convertToDto(CreateNewDogResponseDto, result);
    
            //Format response
            const formatedReponse = new ResponseGenerator<CreateNewDogResponseDto>()
                .createSuccessResponse(responseDtoConverted);
            
            res.json(formatedReponse);
        } catch (error) {
            next(error);
        }
    }
}