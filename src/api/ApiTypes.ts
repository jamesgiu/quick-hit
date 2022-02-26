export enum HttpMethod {
    GET = "get",
    POST = "post",
    PUT = "put",
    PATCH = "patch",
    // Use the below with care, you can delete a whole JSON if you're not careful.
    DELETE = "delete",
}

export enum ApiActions {
    INSTANCES = "instances.json",
    PLAYERS = "player.json",
    MATCHES = "match.json",
    HAPPY_HOUR = "happyhour.json",
    BADGE = "badge.json",
    TOURNAMENT = "tournament.json",
    CHAT = "chat.json",
    MATCH_REACTION = "matchreaction.json",
}
