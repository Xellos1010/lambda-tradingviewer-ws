// src\utils\getAction.ts
const getAction = (data: any): TAction => {
    let action = '';
  
    if (data) {
      if (typeof data === 'string') {
        action = data;
      } else if (data.message) {
        action = data.message;
      } else if (data.action) {
        action = data.action;
      } else {
        action = data.order && data.order.action;
      }
    }
  
    return action as TAction;
  };
  
  export { getAction };
  