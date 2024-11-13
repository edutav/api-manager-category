import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	Unique,
	UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
@Unique(['parent', 'name'])
export class Category {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	isActive: boolean;

	@ManyToOne(() => Category, (category) => category.children, {
		nullable: true,
		onDelete: 'CASCADE',
	})
	parent: Category;

	@OneToMany(() => Category, (category) => category.parent, { cascade: true })
	children: Category[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
