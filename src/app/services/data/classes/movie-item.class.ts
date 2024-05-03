export default class MovieItem {
  private title?: string;
  private year?: string;
  private rated?: string;
  private released?: string;
  private runtime?: string;
  private genre?: string;
  private director?: string;
  private writer?: string;
  private actors?: string;
  private plot?: string;
  private language?: string;
  private country?: string;
  private awards?: string;
  private poster?: string;
  private ratings?: { Source: string; Value: string }[];
  private metascore?: string;
  private imdbRating?: string;
  private imdbVotes?: string;
  private imdbID?: string;
  private type?: string;
  private dvd?: string;
  private boxOffice?: string;
  private production?: string;
  private website?: string;
  private response?: string;

  public setTitle(title: string): this {
    this.title = title;
    return this;
  }

  public setYear(year: string): this {
    this.year = year;
    return this;
  }

  public setRated(rated: string): this {
    this.rated = rated;
    return this;
  }

  public setReleased(released: string): this {
    this.released = released;
    return this;
  }

  public setRuntime(runtime: string): this {
    this.runtime = runtime;
    return this;
  }

  public setGenre(genre: string): this {
    this.genre = genre;
    return this;
  }

  public setDirector(director: string): this {
    this.director = director;
    return this;
  }

  public setWriter(writer: string): this {
    this.writer = writer;
    return this;
  }

  public setActors(actors: string): this {
    this.actors = actors;
    return this;
  }

  public setPlot(plot: string): this {
    this.plot = plot;
    return this;
  }

  public setLanguage(language: string): this {
    this.language = language;
    return this;
  }

  public setCountry(country: string): this {
    this.country = country;
    return this;
  }

  public setAwards(awards: string): this {
    this.awards = awards;
    return this;
  }

  public setPoster(poster: string): this {
    this.poster = poster;
    return this;
  }

  public setRatings(ratings: { Source: string; Value: string }[]): this {
    this.ratings = ratings;
    return this;
  }

  public setMetascore(metascore: string): this {
    this.metascore = metascore;
    return this;
  }

  public setImdbRating(imdbRating: string): this {
    this.imdbRating = imdbRating;
    return this;
  }

  public setImdbVotes(imdbVotes: string): this {
    this.imdbVotes = imdbVotes;
    return this;
  }

  public setImdbID(imdbID: string): this {
    this.imdbID = imdbID;
    return this;
  }

  public setType(type: string): this {
    this.type = type;
    return this;
  }

  public setDvd(dvd: string): this {
    this.dvd = dvd;
    return this;
  }

  public setBoxOffice(boxOffice: string): this {
    this.boxOffice = boxOffice;
    return this;
  }

  public setProduction(production: string): this {
    this.production = production;
    return this;
  }

  public setWebsite(website: string): this {
    this.website = website;
    return this;
  }

  public setResponse(response: string): this {
    this.response = response;
    return this;
  }

  public getTitle(): string | undefined {
    return this.title;
  }

  public getYear(): string {
    return this.year ?? '1970';
  }

  public getRated(): string | undefined {
    return this.rated;
  }

  public getReleased(): string | undefined {
    return this.released;
  }

  public getRuntime(): string | undefined {
    return this.runtime;
  }

  public getGenre(): string | undefined {
    return this.genre;
  }

  public getDirector(): string | undefined {
    return this.director;
  }

  public getWriter(): string | undefined {
    return this.writer;
  }

  public getActors(): string | undefined {
    return this.actors;
  }

  public getPlot(): string | undefined {
    return this.plot;
  }

  public getLanguage(): string | undefined {
    return this.language;
  }

  public getCountry(): string | undefined {
    return this.country;
  }

  public getAwards(): string | undefined {
    return this.awards;
  }

  public getPoster(): string | undefined {
    return this.poster;
  }

  public getRatings(): { Source: string; Value: string }[] | undefined {
    return this.ratings;
  }

  public getMetascore(): string | undefined {
    return this.metascore;
  }

  public getImdbRating(): string {
    return this.imdbRating ?? '0';
  }

  public getImdbVotes(): string | undefined {
    return this.imdbVotes;
  }

  public getImdbID(): string | undefined {
    return this.imdbID;
  }

  public getType(): string | undefined {
    return this.type;
  }

  public getDvd(): string | undefined {
    return this.dvd;
  }

  public getBoxOffice(): string | undefined {
    return this.boxOffice;
  }

  public getProduction(): string | undefined {
    return this.production;
  }

  public getWebsite(): string | undefined {
    return this.website;
  }

  public getResponse(): string | undefined {
    return this.response;
  }
}
