   private static nameofclass instance;
        public static nameofclass Instance
        {
            get
            {
                if (instance == null) instance = new nameofclass();
                return instance;
            }
        }
