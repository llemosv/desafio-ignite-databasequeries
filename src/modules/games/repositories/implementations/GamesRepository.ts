import { createQueryBuilder, getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder()
      .select("games")
      .from (Game, "games")
      .where("LOWER(games.title) like LOWER(:title)", {title: `%${param}%`})
      .getMany()
      // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(
      `SELECT
      COUNT(ID)
    FROM games`
    ); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
    .createQueryBuilder()
    .select("users")
    .from(User, "users")
    .innerJoin("users_games_games", "users_games_games","users_games_games.usersId = users.id")
    .where("users_games_games.gamesId = :gamesId", {gamesId: id})
    .getMany()
      // Complete usando query builder
  }
}
