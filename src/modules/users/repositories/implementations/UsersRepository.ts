import { getRepository, Repository } from 'typeorm';
import { Game } from '../../../games/entities/Game';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne({id: user_id})
    if(!user){
      throw new Error('Deu ruim');
    }
    
    const games = await this.repository
      .createQueryBuilder()
      .select("games")
      .from(Game, "games")
      .innerJoin("users_games_games", "users_games_games","users_games_games.gamesId = games.id")
      .where("users_games_games.usersId = :usersId", {usersId: user.id})
      .orderBy("users_games_games")
      .getMany()
    
    user.games = games
    return user;

    // Complete usando ORM
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(
      `
      SELECT 
        *
      FROM users
      ORDER BY first_name
      `
      );
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(
      `
      SELECT
        *
      FROM users
      WHERE LOWER(first_name) = LOWER($1)
        AND LOWER(last_name) = LOWER($2)
      `, [first_name, last_name]
    );
  }
}
