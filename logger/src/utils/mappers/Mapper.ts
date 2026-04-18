export default abstract class Mapper<Entity, DTO> {
  abstract mapToDTO(entity: Entity): DTO;
  abstract mapToEntity(dto: DTO): Entity;
}
