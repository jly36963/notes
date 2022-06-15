from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class Post(BaseModel):
    user_id: int
    post: str = None
    date: Optional[datetime] = datetime.now()


# {
#     "user_id": 3,
#     "post": "Hello World",
#     "date": "2020-09-14T18:32:00"
# }
