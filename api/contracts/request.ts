declare module '@ioc:Adonis/Core/Request' {
    interface RequestContract {
        requestData: {
            id: string;
            username: string;
            [key: string]: any;
          };
    }
  }