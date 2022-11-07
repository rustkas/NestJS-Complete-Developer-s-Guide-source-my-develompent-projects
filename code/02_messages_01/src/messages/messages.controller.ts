import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {

    messagesService: MessagesService;
    constructor() {
        // Service is creating its own dependencies
        // DONT DO THIS ON REAL APPS
        // USE DEPENDECY INJECTION
        this.messagesService = new MessagesService();
    }

    @Get()
    listMessages(){
        return this.messagesService.findAll();
    }

    @Post()
    createMessage(@Body() body: CreateMessageDto) {
        // return {"content": "hi there"};
        // console.log(body);
        return this.messagesService.create(body.content);
    }

    @Get(':id')
    async getMessage(@Param('id') id: string) {
        // return '';
        // console.log(id);
        const message = await this.messagesService.findOne(id);
        if(!message) {
            throw new NotFoundException('message is not found');
        }

        return message;
    }
}
