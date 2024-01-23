import { ApiResponseProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/shared/base-response.response';

export class DetailConversationResponse  {
   
      conversation_id: string;
    
    
      name: string;
    
     
      type: number;
    
     
      is_pinned: number;
    
    
      is_notify: number;
    
      is_hidden: number;
    
    
      is_confirm_new_member: number;
    
      
      no_of_not_seen: number;
    
      
      no_of_member: number;
    
     
      no_of_waiting_confirm: number;
    
      
      my_permission: number;
    
      
      avatar: any;
    
     
      background: any;
    
    

      last_message: string;
    
     
      position: string;
    
      
      last_activity: any;
    
      
      created_at: any;
    
     
      updated_at: any;
    
     
      members: any;
    
    
      last_connect: string;
    
      constructor(result?: any) {
        
        const data = result._doc
        this.conversation_id = data?._id || '';
        this.name = data?.name || '';
        this.type = data?.type || 0;
        this.is_pinned = +data?.is_pinned || 0;
        this.is_notify = +data?.is_notify || 0;
        this.is_hidden = +data?.is_hidden || 0;
        this.is_confirm_new_member = +data?.is_confirm_new_member || 0;
        this.no_of_member = data?.no_of_member || 0;
        this.no_of_not_seen = +data?.no_of_not_seen || 0;
        this.no_of_waiting_confirm = +data?.no_of_waiting_confirm || 0;
        this.my_permission = data?.my_permission || 0;
        this.avatar = data?.type ==data?.avatar || ''
        this.background =data?.background ||  ''
        
        this.members = result?.members || [];
        this.position = data?.last_activity || '';
        this.created_at =data?.created_at || '';
        this.updated_at =data?.updated_at || '';
        this.last_activity =data?.last_activity || '';
        this.last_connect = data?.last_connect || '';
    
      }
}
