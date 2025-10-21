package com.powercatsui.powercatsui.models;


//import br.ifsc.edu.fln.iotprojectapi.dtos.CreateUserDTO;
//import br.ifsc.edu.fln.iotprojectapi.dtos.UpdateUser;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "client_user") //todo name = "users"
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(name = "user_name", nullable=false, length = 100)
    private String name;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "pswd", nullable = false)
    private String password;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String fone;

    @Column(name = "birthdate")
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)//string para o banco
    @Column(name = "permission", nullable = false)
    private EPermission permission;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;

    @Column(name = "active", nullable = false)
    private boolean active;

//    @OneToMany(
//            mappedBy = "user",
//            cascade = {CascadeType.PERSIST, CascadeType.MERGE},
//            orphanRemoval = false,
//            fetch = FetchType.LAZY
//    )
//    @JsonIgnoreProperties({"user", "hibernateLazyInitializer", "handler"})
//    private List<ChannelUser> channelUsers = new ArrayList<>();

//    public User(UpdateUser json) {
//        this.id = json.id();
//        this.name = json.name();
//        this.email = json.email();
//        this.password = json.password();
//        this.fone = json.fone();
//        this.birthDate = json.birthDate();
//        this.permission = json.permission();
//        this.address = new Address(json.addressDTO());
//        this.active = json.active();
//    }
//
//    public void addChannelUser(ChannelUser channelUser){
//        this.channelUsers.add(channelUser);
//        channelUser.setUser(this);
//    }
//
//    public void removeChannelUser(ChannelUser channelUser){
//        this.channelUsers.remove(channelUser);
//        channelUser.setUser(null);
//    }
//
//    public User(CreateUserDTO json){
//        this.name = json.name();
//        this.email = json.email();
//        this.password = json.password();
//        this.fone = json.fone();
//        this.birthDate = json.birthDate();
//        this.permission = json.permission();
//        this.address = new Address(json.address());
//        this.active = json.active();
//    }
//
//    public void excluir() {
//        this.active = false;
//    }
//
//    public void atualizarInformacoes(@Valid UpdateUser json) {
//        if (json.name() != null){
//            this.name = json.name();
//        }
//        if (json.fone() != null){
//            this.fone = json.fone();
//        }
//        if (json.name() != null){
//            this.email = json.email();
//        }
//        if (json.active() != null){
//            this.active = json.active();
//        }
//        if (json.permission() != null){
//            this.permission = json.permission();
//        }
//        if (json.addressDTO() != null){
//            this.address.atualizarInformacoes(json.addressDTO());
//        }
//
//    }
}
